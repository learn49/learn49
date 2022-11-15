import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, MoreThan, Repository } from 'typeorm';
import { AppExceptions } from '../../utils/AppExceptions';

import { UserRole } from '../users/user-role.entity';
import { LastCourseAccess } from '../last-course-access/last-course-access.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { CourseLesson } from './course-lessons.entity';
import { LessonProgress } from './lesson-progress.entity';
import { ICourseModuleRepository } from '../course-modules/repositories/course-module-repository.interface';
import {
  ChangeSortOrderArgs,
  CompletedArgs,
  CopyModuleLessonsArgs,
  CreateCourseLessonArgs,
  CreateOrUpdateLastCourseLessonAccessArgs,
  DeleteByIdArgs,
  FindAllCourseLessonsArgs,
  FindNextLessonArgs,
  FindOneByEnrollmentArgs,
  FindOneLessonArgs,
  MarkLessonAsSeenArgs,
  UpdateArgs,
} from './types';

@Injectable()
export class CourseLessonService {
  constructor(
    @InjectRepository(CourseLesson)
    private readonly courseLessonRepository: Repository<CourseLesson>,
    @Inject('COURSE_MODULE_REPOSITORY')
    private readonly courseModuleRepository: ICourseModuleRepository,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(LastCourseAccess)
    private readonly lastCourseAccessRepository: Repository<LastCourseAccess>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) { }

  async create({
    accountId,
    userId,
    courseId,
    moduleId,
    courseVersionId,
    title,
    sortOrder,
  }: CreateCourseLessonArgs): Promise<CourseLesson> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const courseModule = await this.courseModuleRepository.findOne({
      id: moduleId,
      accountId,
      courseVersionId,
    });

    if (!courseModule) {
      throw AppExceptions.CourseModuleNotFound;
    }

    if (courseModule.baseModuleId) {
      await this.copyModuleLessons({
        accountId,
        moduleId,
        baseModuleId: courseModule.baseModuleId,
      });

      courseModule.baseModuleId = null;

      await this.courseModuleRepository.save(courseModule);
    }

    const createdLesson = this.courseLessonRepository.create({
      accountId,
      courseId,
      moduleId,
      courseVersionId,
      title,
      sortOrder,
      status: 'draft',
    });

    const lesson = await this.courseLessonRepository.save(createdLesson);

    return lesson;
  }

  private async copyModuleLessons({
    accountId,
    moduleId,
    baseModuleId,
  }: CopyModuleLessonsArgs): Promise<CourseLesson[]> {
    const lessons = await this.courseLessonRepository.find({
      where: {
        accountId,
        moduleId: baseModuleId,
      },
    });

    const parseCopiedLessons = lessons.map(eachLesson => ({
      accountId: eachLesson.accountId,
      courseId: eachLesson.courseId,
      courseVersionId: eachLesson.courseVersionId,
      sortOrder: eachLesson.sortOrder,
      type: eachLesson.type,
      title: eachLesson.title,
      status: eachLesson.status,
      releaseAfter: eachLesson.releaseAfter,
      releaseOnDate: eachLesson.releaseOnDate,
      moduleId,
      blocks: eachLesson.blocks,
      baseLessonId: eachLesson.baseLessonId
        ? eachLesson.baseLessonId
        : eachLesson.id,
    })) as CourseLesson[];

    const createdCopiedLessons = this.courseLessonRepository.create(
      parseCopiedLessons,
    );

    const copiedLessons = await this.courseLessonRepository.save(
      createdCopiedLessons,
    );

    return copiedLessons;
  }

  async findAll({
    accountId,
    moduleId,
    baseId,
    limit,
    offset,
  }: FindAllCourseLessonsArgs) {
    let query = this.courseLessonRepository
      .createQueryBuilder('course_lessons')
      .where('course_lessons.module_id = :moduleId', {
        moduleId: baseId || moduleId,
      })
      .orderBy('course_lessons.sort_order', 'ASC');

    if (limit) {
      query = query.take(limit);
    }

    if (offset) {
      query = query.offset(offset);
    }

    const lessons = await query.getMany();

    const totalCount = await this.courseLessonRepository.count({
      where: {
        accountId,
      },
    });

    return {
      lessons,
      totalCount,
    };
  }

  async findOne({ accountId, lessonId }: FindOneLessonArgs) {
    const lesson = await this.courseLessonRepository.findOne({
      where: {
        id: lessonId,
        accountId,
      },
    });

    if (!lesson) {
      throw AppExceptions.LessonNotFound;
    }

    const blocks = lesson.blocks ? JSON.stringify(lesson.blocks) : null;

    return {
      ...lesson,
      blocks,
    };
  }

  // FIXME: unificar metodo com o findOne
  async findOneByEnrollment({
    accountId,
    userId,
    courseId,
    courseVersionId,
    lessonId,
  }: FindOneByEnrollmentArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    let enrollment: Enrollment = null;

    if (userRole.role === 'user') {
      const enrollmentByCourseId = await this.enrollmentRepository.findOne({
        where: {
          userId,
          accountId,
          courseId,
          status: 'active',
        },
      });

      if (enrollmentByCourseId) {
        enrollment = enrollmentByCourseId;
      }

      if (!enrollmentByCourseId) {
        enrollment = await this.enrollmentRepository
          .createQueryBuilder('enrollment')
          .innerJoin(
            'label_enrollment',
            'label_enrollment',
            'enrollment.id = label_enrollment.enrollment_id',
          )
          .innerJoin(
            'label_course',
            'label_course',
            'label_enrollment.label_id = label_course.label_id',
          )
          .where(`label_course.course_id = '${courseId}'`)
          .andWhere(`enrollment.user_id = '${userId}'`)
          .andWhere(`enrollment.account_id = '${accountId}'`)
          .andWhere(`enrollment.status = 'active'`)
          .getOne();
      }

      if (!enrollment) {
        throw AppExceptions.EnrollmentNotFound;
      }

      if (new Date(enrollment.startDate) > new Date()) {
        throw AppExceptions.EnrollmentNotStarted;
      }

      if (enrollment.endDate && new Date() > new Date(enrollment.endDate)) {
        throw AppExceptions.EnrollmentExpired;
      }
    }

    const lesson = await this.courseLessonRepository.findOne({
      where: {
        id: lessonId,
        accountId,
        courseId,
      },
    });

    if (lesson.status === 'draft') {
      throw AppExceptions.LessonNotAvailable;
    }

    let releaseOnDate = null;

    if (userRole.role === 'user' && lesson.releaseOnDate) {
      releaseOnDate = lesson.releaseOnDate;
    } else if (userRole.role === 'user' && lesson.releaseAfter) {
      const startDate = new Date(enrollment.startDate);
      startDate.setDate(startDate.getDate() + lesson.releaseAfter);

      releaseOnDate = startDate;
    }

    const totalLesson = await this.courseLessonRepository.count({
      where: {
        moduleId: lesson.moduleId,
        courseVersionId,
      },
    });

    let nextLesson = '';

    if (lesson.sortOrder < totalLesson) {
      let getNextLesson;

      const currentModule = await this.courseModuleRepository.findOne({
        id: lesson.moduleId,
        accountId,
        courseVersionId,
      });

      const nextModule = await this.courseModuleRepository.findOne({
        accountId,
        courseVersionId,
        sortOrder: {
          direction: 'GT',
          value: currentModule.sortOrder,
        },
        isActive: true,
        order: {
          sortOrder: 'ASC',
        },
      });

      getNextLesson = await this.findNextLesson({
        accountId,
        courseId,
        moduleId: lesson.moduleId,
        sortOrder: lesson.sortOrder,
        role: userRole.role,
        enrollment,
      });

      if (getNextLesson) {
        nextLesson = getNextLesson.id;
      } else {
        if (!nextModule) {
          nextLesson = null;
        } else {
          getNextLesson = await this.findNextLesson({
            accountId,
            courseId,
            moduleId: nextModule.id,
            sortOrder: 0,
            role: userRole.role,
            enrollment,
          });

          if (getNextLesson) {
            nextLesson = getNextLesson.id;
          }
        }
      }
    } else if (lesson.sortOrder === totalLesson) {
      const currentModule = await this.courseModuleRepository.findOne({
        id: lesson.moduleId,
        accountId,
        courseVersionId,
      });

      const nextModule = await this.courseModuleRepository.findOne({
        accountId,
        courseVersionId,
        sortOrder: {
          direction: 'GT',
          value: currentModule.sortOrder,
        },
        isActive: true,
        order: {
          sortOrder: 'ASC',
        },
      });

      if (!nextModule) {
        nextLesson = null;
      } else {
        const getNextLesson = await this.findNextLesson({
          accountId,
          courseId,
          moduleId: nextModule.id,
          sortOrder: 0,
          role: userRole.role,
          enrollment,
        });

        if (getNextLesson) {
          nextLesson = getNextLesson.id;
        }
      }
    }

    const lessonProgress = await this.lessonProgressRepository.findOne({
      where: {
        lessonId: lesson.baseLessonId || lesson.id,
        userId,
      },
    });

    if (!lessonProgress) {
      const createdLessonProgress = this.lessonProgressRepository.create({
        accountId,
        courseId,
        courseVersionId,
        lessonId: lesson.baseLessonId || lesson.id,
        userId,
        startedAt: new Date(),
        completed: false,
      });
      await this.lessonProgressRepository.save(createdLessonProgress);
    }

    return {
      id: lesson.id,
      accountId: lesson.accountId,
      title: lesson.title,
      blocks: JSON.stringify(lesson.blocks),
      sortOrder: lesson.sortOrder,
      releaseOnDate,
      baseLessonId: lesson.baseLessonId,
      moduleId: lesson.moduleId,
      nextLesson,
    };
  }

  async createOrUpdateLastCourseLessonAccess({
    accountId,
    userId,
    courseId,
    courseVersionId,
    lessonId,
  }: CreateOrUpdateLastCourseLessonAccessArgs): Promise<CourseLesson> {
    const lesson = await this.courseLessonRepository.findOne({
      where: {
        id: lessonId,
        accountId,
        courseId,
      },
    });

    if (!lesson) {
      throw AppExceptions.LessonNotFound;
    }

    const lastCourseAccess = await this.lastCourseAccessRepository.findOne({
      where: {
        accountId,
        userId,
        courseId,
      },
    });

    if (lastCourseAccess) {
      lastCourseAccess.courseVersionId = courseVersionId;
      lastCourseAccess.moduleId = lesson.moduleId;
      lastCourseAccess.lessonId = lesson.baseLessonId || lesson.id;
      lastCourseAccess.updatedAt = new Date();

      await this.lastCourseAccessRepository.save(lastCourseAccess);
    } else {
      const createdLastCourseAccess = this.lastCourseAccessRepository.create({
        accountId,
        userId,
        courseId,
        courseVersionId,
        moduleId: lesson.moduleId,
        lessonId: lesson.baseLessonId || lesson.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.lastCourseAccessRepository.save(createdLastCourseAccess);
    }

    return lesson;
  }

  async markAsSeen({
    accountId,
    userId,
    courseId,
    lessonId,
    isCompleted,
  }: MarkLessonAsSeenArgs): Promise<CourseLesson> {
    let enrollment;

    const enrollmentByCourseId = await this.enrollmentRepository.findOne({
      where: {
        userId,
        accountId,
        courseId,
        status: 'active',
      },
    });

    if (enrollmentByCourseId) {
      enrollment = enrollmentByCourseId;
    }

    if (!enrollmentByCourseId) {
      enrollment = await this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .innerJoin(
          'label_enrollment',
          'label_enrollment',
          'enrollment.id = label_enrollment.enrollment_id',
        )
        .innerJoin(
          'label_course',
          'label_course',
          'label_enrollment.label_id = label_course.label_id',
        )
        .where(`label_course.course_id = '${courseId}'`)
        .andWhere(`enrollment.user_id = '${userId}'`)
        .andWhere(`enrollment.account_id = '${accountId}'`)
        .andWhere(`enrollment.status = 'active'`)
        .getOne();
    }

    if (!enrollment) {
      throw AppExceptions.EnrollmentNotFound;
    }

    if (new Date(enrollment.startDate) > new Date()) {
      throw AppExceptions.EnrollmentNotStarted;
    }

    if (enrollment.endDate && new Date() > new Date(enrollment.endDate)) {
      throw AppExceptions.EnrollmentExpired;
    }

    const lesson = await this.courseLessonRepository.findOne({
      where: {
        id: lessonId,
        accountId,
      },
    });

    if (!lesson) {
      throw AppExceptions.LessonNotFound;
    }

    const lessonProgress = await this.lessonProgressRepository.findOne({
      where: {
        accountId,
        lessonId,
        userId,
      },
    });

    if (!lessonProgress) {
      throw AppExceptions.LessonProgressNotFound;
    }

    lessonProgress.completed = isCompleted;
    lessonProgress.completedAt = new Date();

    await this.lessonProgressRepository.save(lessonProgress);

    return lesson;
  }

  async update({
    accountId,
    userId,
    lessonId,
    blocks,
    ...input
  }: UpdateArgs): Promise<CourseLesson> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const lesson = await this.courseLessonRepository.findOne({
      where: {
        id: lessonId,
        accountId,
      },
    });

    if (!lesson) {
      throw AppExceptions.LessonNotFound;
    }

    if (blocks) lesson.blocks = JSON.parse(blocks);

    Object.assign(lesson, {
      ...input,
      blocks: lesson.blocks,
    });

    return this.courseLessonRepository.save(lesson);
  }

  async changeSortOrder({
    accountId,
    userId,
    courseId,
    courseVersionId,
    moduleId,
    lessons,
    baseId,
  }: ChangeSortOrderArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    if (baseId) {
      const reorderedLessons = lessons.map((lesson, index) =>
        this.courseLessonRepository.create({
          accountId,
          courseId,
          moduleId,
          courseVersionId,
          title: lesson.title,
          status: lesson.status,
          releaseOnDate: lesson.releaseOnDate,
          releaseAfter: lesson.releaseAfter,
          blocks: lesson.blocks,
          baseLessonId: lesson.baseLessonId ? lesson.baseLessonId : lesson.id,
          sortOrder: index + 1,
        }),
      );

      const module = await this.courseModuleRepository.findOne({
        id: moduleId,
        accountId,
      });

      if (!module) {
        throw AppExceptions.CourseModuleNotFound;
      }

      module.baseModuleId = null;

      await this.courseModuleRepository.save(module);

      await this.courseLessonRepository.save(reorderedLessons);

      return 'Sort order has been changed';
    }

    const reorderLessonPromise = lessons.map(async (lesson, index) => {
      const isValidLesson = await this.courseLessonRepository.findOne({
        where: {
          id: lesson.id,
          accountId,
          courseId,
          moduleId,
          courseVersionId,
        },
      });

      if (!isValidLesson) {
        throw AppExceptions.LessonNotFound;
      }

      isValidLesson.sortOrder = index + 1;

      await this.courseLessonRepository.save(isValidLesson);
    });

    await Promise.all(reorderLessonPromise);

    return 'Sort order has been changed';
  }

  async completed({
    lessonId,
    accountId,
    userId,
  }: CompletedArgs): Promise<boolean> {
    if (!userId) return false;
    const lessonProgress = await this.lessonProgressRepository.findOne({
      lessonId,
      accountId,
      userId,
    });
    return lessonProgress?.completed ?? false;
  }

  async deleteById({
    accountId,
    lessonId,
    userId,
  }: DeleteByIdArgs): Promise<string> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const lesson = await this.courseLessonRepository.findOne({
      where: {
        id: lessonId,
        accountId,
      },
    });

    if (!lesson) {
      throw AppExceptions.LessonNotFound;
    }

    await this.courseLessonRepository.remove(lesson);

    const lessons = await this.courseLessonRepository.find({
      where: {
        accountId,
        moduleId: lesson.moduleId,
      },
      order: {
        sortOrder: 'ASC',
      },
    });

    const reorderLessonsPromise = lessons.map(async (eachLesson, index) => {
      eachLesson.sortOrder = index + 1;

      await this.courseLessonRepository.save(eachLesson);
    });

    await Promise.all(reorderLessonsPromise);

    return lessonId;
  }

  private async findNextLesson({
    accountId,
    courseId,
    moduleId,
    sortOrder,
    enrollment,
    role,
  }: FindNextLessonArgs): Promise<CourseLesson | null> {
    let nextLesson: CourseLesson | null = null;

    if (enrollment && role === 'user') {
      nextLesson = await this.courseLessonRepository
        .createQueryBuilder('course_lessons')
        .where('course_lessons.account_id = :accountId', { accountId })
        .andWhere('course_lessons.course_id = :courseId', { courseId })
        .andWhere('course_lessons.module_id = :moduleId', { moduleId })
        .andWhere(`course_lessons.status = 'published'`)
        .andWhere('course_lessons.sort_order > :sortOrder', { sortOrder })
        .andWhere(
          new Brackets(qb => {
            qb.where('course_lessons.release_on_date IS NULL');
            qb.orWhere('course_lessons.release_on_date < :now', {
              now: new Date(),
            });
          }),
        )
        .andWhere(
          new Brackets(qb => {
            qb.where('course_lessons.release_after IS NULL');
            qb.orWhere(
              `:enrollmentStartDate::date + interval '1 day' * course_lessons.release_after < :now`,
              {
                enrollmentStartDate: new Date(enrollment.startDate),
                now: new Date(),
              },
            );
          }),
        )
        .orderBy('course_lessons.sort_order', 'ASC')
        .getOne();
    } else if (role === 'owner' || role === 'admin') {
      nextLesson = await this.courseLessonRepository.findOne({
        where: {
          accountId,
          courseId,
          moduleId,
          status: 'published',
          sortOrder: MoreThan(sortOrder),
        },
      });
    }

    return nextLesson;
  }
}
