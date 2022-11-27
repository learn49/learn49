import { AppExceptions } from '@/utils/AppExceptions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, In, Repository } from 'typeorm';
import slugify from 'slugify';
import { LessonProgress } from '../course-lessons/lesson-progress.entity';
import { ICourseVersionRepository } from '../course-versions/repositories/course-version-repository.interface';
import { Enrollment } from '../enrollment/dto/enrollment';
import { UserRole } from '../users/user-role.entity';
import { User } from '../users/user.entity';
import { LessonProxy } from './lesson-proxy.entity';
import { ModuleProxy } from './module-proxy.entity';
import { ICourseRepository } from './repositories/course-repository.interface';
import {
  CourseArgs,
  DestroyArgs,
  FindAllArgs,
  FindOneArgs,
  ProgressArgs,
  UpdateArgs,
} from './types';
import { Label } from '../labels/label.entity';

const uuid = require('uuid');

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @Inject('COURSE_VERSION_REPOSITORY')
    private readonly courseVersionRepository: ICourseVersionRepository,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepository: ICourseRepository,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(ModuleProxy)
    private readonly moduleProxyRepository: Repository<ModuleProxy>,
    @InjectRepository(LessonProxy)
    private readonly lessonProxyRepository: Repository<LessonProxy>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
  ) { }

  async create({
    userId,
    accountId,
    title,
    description,
    versionName,
    labels,
  }: CourseArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.OnlyOwnerCanCreateCourses;
    }

    const course = await this.courseRepository.create({
      accountId,
      title,
      description,
      defaultVersion: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      labels,
    });

    await this.courseVersionRepository.create({
      id: course.defaultVersion,
      courseId: course.id,
      accountId: course.accountId,
      name: versionName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return course;
  }

  async findOne({ accountId, courseId }: FindOneArgs) {
    return await this.courseRepository.findOne({
      id: courseId,
      accountId,
    });
  }

  async findAll({ accountId, userId, limit, offset }: FindAllArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    // @todo:  considerar os outros papeis
    if (!userRole || userRole.role === 'owner') {
      const courses = await this.courseRepository.findAll({
        accountId,
        offset,
        limit,
      });

      const totalCount = await this.courseRepository.count(accountId);

      return { courses, totalCount };
    }

    // @todo: adicionar condicional para tutor visualizar as lições
    //@TODO falta terminar os select
    const queryEnrollment = this.enrollmentRepository
      .createQueryBuilder('enrollments')
      .select('enrollments.id as id')
      .addSelect('title', 'title')
      .addSelect('description', 'description')
      .addSelect('enrollments.course_version_id', 'courseVersionId')
      .addSelect('enrollments.type', 'type')
      .addSelect('enrollments.course_id', 'courseId')
      .leftJoin('courses', 'courses', 'courses.id = enrollments.course_id')
      .where(
        "enrollments.user_id = :userId and enrollments.account_id = :accountId and enrollments.status = 'active'",
        {
          userId,
          accountId,
        },
      );

    const enrollments = await queryEnrollment.getRawMany<Enrollment & User>();

    if (enrollments.length <= 0) {
      return { courses: [] };
    }

    const parsedCourses = [];

    for (const enrollment of enrollments) {
      const courses = await getManager().query(
        `
          SELECT
            *
          FROM
            courses
          WHERE
            id IN (
              SELECT course_id FROM label_course WHERE label_id IN (
                SELECT label_id FROM label_enrollment 
                WHERE enrollment_id = '${enrollment.id}'
              )
            )${enrollment.courseId ? ` OR id = '${enrollment.courseId}'` : ''};
        `,
      );

      const coursesWithVersionsPromise = courses.map(async course => {
        let versions = null;
        let latest_version = null;

        if (enrollment.type === 'specificVersion') {
          versions = [enrollment.courseVersionId];
          latest_version = enrollment.courseVersionId;
        }

        if (enrollment.type === 'allVersions') {
          const courseVersions = await this.courseVersionRepository.findAll({
            accountId,
            courseId: course.id,
            order: {
              createdAt: 'DESC',
            },
          });
          versions = courseVersions.map(version => version.id);
          latest_version = courseVersions[0].id;
        }

        if (enrollment.type === 'onlyLatest') {
          const {
            id: courseVersionId,
          } = await this.courseVersionRepository.findOne({
            accountId,
            courseId: course.id,
          });

          versions = [courseVersionId];
          latest_version = courseVersionId;
        }

        if (enrollment.type === 'allNewVersions') {
          //TODO - Fazer
          const courseVersions = await this.courseVersionRepository.findAll({
            whereRaw: `account_id = '${accountId}' and course_id = '${course.id}' and created_at >= (select created_at from course_versions where account_id = '${accountId}' and id = '${enrollment.courseVersionId}')`,
            order: { createdAt: 'DESC' },
          });

          versions = courseVersions.map(version => version.id);
          latest_version = courseVersions[0].id;
        }

        const { labels } = await this.courseRepository.findOne({
          id: course.id,
          accountId,
        });

        return {
          ...course,
          labels,
          versions,
          latestVersion: latest_version,
        };
      });

      const coursesWithVersions = await Promise.all(coursesWithVersionsPromise);

      parsedCourses.push(...coursesWithVersions);
    }

    return { courses: parsedCourses };
  }

  async update({
    userId,
    accountId,
    courseId,
    title,
    description,
    image,
    videoPreview,
    defaultVersion,
    slug,
    duration,
    labels,
  }: UpdateArgs) {
    const userRole = await this.userRoleRepository.findOne({
      userId,
      accountId,
    });
    if (!userRole) throw AppExceptions.UserNotFound;
    if (userRole.role !== 'owner')
      throw AppExceptions.OnlyOwnerCanCreateCourses;

    const course = await this.courseRepository.findOne({
      id: courseId,
      accountId,
    });
    if (!course) throw AppExceptions.CourseNotFound;

    if (title) course.title = title;
    if (description) course.description = description;
    if (image) course.image = image;
    if (videoPreview) course.videoPreview = videoPreview;
    if (defaultVersion) course.defaultVersion = defaultVersion;
    if (duration) course.duration = duration;
    if (slug) course.slug = slugify(slug).toLowerCase();

    if (labels) {
      const labelsList = labels.map(({ id }) => {
        const label = new Label();
        label.id = id;
        return label;
      });
      course.labels = labelsList;
    }

    course.updatedAt = new Date();
    await this.courseRepository.save(course);
    return course;
  }

  async destroy({ accountId, userId, courseId }: DestroyArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (!userRole) {
      throw AppExceptions.UserNotFound;
    }

    if (userRole.role !== 'owner') {
      throw AppExceptions.OnlyOwnerCanCreateCourses;
    }

    const course = await this.courseRepository.findOne({
      id: courseId,
      accountId,
    });

    if (!course) {
      throw AppExceptions.CourseNotFound;
    }

    await this.courseRepository.remove(course);

    const courseVersions = await this.courseVersionRepository.findAll({
      courseId,
    });

    const removeCourseVersionPromise = courseVersions.map(courseVersion =>
      this.courseVersionRepository.remove(courseVersion),
    );

    await Promise.all(removeCourseVersionPromise);

    return {
      id: courseId,
    };
  }

  async progress({ userId, courseId }: ProgressArgs) {
    const courseVersions = await this.courseVersionRepository.findAll({
      courseId,
    });

    const modules = await this.moduleProxyRepository.find({
      courseVersionId: courseVersions[0].id,
    });

    const moduleIds = modules.map(module => module.proxyId);

    const [
      lessons,
      totalLessons,
    ] = await this.lessonProxyRepository.findAndCount({
      where: {
        courseId,
        status: 'published',
        moduleId: In([...moduleIds]),
      },
    });

    const lessonsIds = lessons.map(lesson => lesson.proxyId);

    const [
      _,
      totalLessonProgress,
    ] = await this.lessonProgressRepository.findAndCount({
      where: {
        courseId,
        completed: true,
        userId,
        lessonId: In([...lessonsIds]),
      },
    });

    const totalLessonsCount = totalLessons || 0;
    const totalLessonProgressCount = totalLessonProgress || 0;

    if (totalLessonsCount === 0 && totalLessonProgressCount === 0) {
      return 0;
    }

    return (totalLessonProgressCount / totalLessonsCount) * 100;
  }
}
