import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from '../users/user-role.entity';
import { AppExceptions } from '../../utils/AppExceptions';
import { CourseLesson } from '../course-lessons/course-lessons.entity';
import { Enrollment } from '../enrollment/enrollment.entity';

import { CourseModule } from './course-modules.entity';
import { ICourseModuleRepository } from './repositories/course-module-repository.interface';
import {
  ChangeCourseModuleSortOrderArgs,
  CreateCourseModuleArgs,
  DeleteCourseModuleArgs,
  FindAllCourseModuleArgs,
  FindLessonsByModuleIdArgs,
  FindOneCourseModuleArgs,
  UpdateCourseModuleArgs,
} from './types';

@Injectable()
export class CourseModuleService {
  constructor(
    @Inject('COURSE_MODULE_REPOSITORY')
    private readonly courseModuleRepository: ICourseModuleRepository,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(CourseLesson)
    private readonly courseLessonRepository: Repository<CourseLesson>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) { }

  async create({
    accountId,
    userId,
    courseVersionId,
    title,
    sortOrder,
  }: CreateCourseModuleArgs): Promise<CourseModule> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const courseModule = await this.courseModuleRepository.create({
      accountId,
      courseVersionId,
      title,
      isActive: false,
      sortOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return courseModule;
  }

  async findAll({
    accountId,
    courseVersionId,
    limit,
    offset,
    userId,
  }: FindAllCourseModuleArgs): Promise<{
    modules: CourseModule[];
    totalCount: number;
  }> {
    const defaultParams = { accountId, courseVersionId };
    let userRole: UserRole;
    if (userId) {
      userRole = await this.userRoleRepository.findOne({
        userId,
        accountId,
      });
    }
    const modules = await this.courseModuleRepository.findAll({
      ...defaultParams,
      isActive: userRole?.role === 'owner' ? undefined : true,
      limit,
      offset,
      order: {
        sortOrder: 'ASC',
      },
    });
    const totalCount = await this.courseModuleRepository.count(defaultParams);
    return { modules, totalCount };
  }

  async findOne({
    accountId,
    courseVersionId,
    courseModuleId,
    userId,
  }: FindOneCourseModuleArgs): Promise<{ courseModule: CourseModule }> {
    const userRole = await this.userRoleRepository.findOne({
      userId,
      accountId,
    });
    if (!userRole) throw AppExceptions.UserNotFound;
    const courseModule = await this.courseModuleRepository.findOne({
      id: courseModuleId,
      accountId,
      courseVersionId,
      isActive: userRole?.role !== 'owner' ? true : undefined,
    });
    if (!courseModule) throw AppExceptions.CourseModuleNotFound;
    return { courseModule };
  }

  async findLessonsByModuleId({
    moduleId,
    userId,
    courseVersionId,
  }: FindLessonsByModuleIdArgs) {
    const lessons = await this.courseLessonRepository
      .createQueryBuilder('course_lessons')
      .select('course_lessons.id')
      .addSelect('course_lessons.accountId')
      .addSelect('course_lessons.title')
      .addSelect('course_lessons.courseId')
      .addSelect('course_lessons_base.title', 'baseTitle')
      .addSelect('course_lessons.baseLessonId')
      .addSelect('course_lessons.releaseOnDate')
      .addSelect('course_lessons.releaseAfter')
      .leftJoin(
        'course_lessons',
        'course_lessons_base',
        'course_lessons_base.id = course_lessons.baseLessonId',
      )
      .where('course_lessons.moduleId = :moduleId', { moduleId })
      .andWhere('course_lessons.status = :status', { status: 'published' })
      .orderBy('course_lessons.sortOrder', 'ASC')
      .getMany();

    let userRole = { role: 'user' };
    let enrollment;
    if (userId) {
      userRole = await this.userRoleRepository.findOne({ userId });
      enrollment = await this.enrollmentRepository.findOne({
        where: {
          userId,
          //TODO: Adicionei aqui para mostrar no admin
          courseId: lessons[0] ? lessons[0].courseId : courseVersionId,
          status: 'active',
        },
      });
    }

    return lessons.map(lesson => {
      let releaseOnDate = null;

      if (userRole.role === 'user') {
        if (lesson.releaseOnDate) {
          releaseOnDate = lesson.releaseOnDate;
        } else if (lesson.releaseAfter) {
          //TODO: Adicionei aqui para quebrar no admin
          const startDate = enrollment?.startDate
            ? new Date(enrollment.startDate)
            : new Date();
          startDate.setDate(startDate.getDate() + lesson.releaseAfter);

          releaseOnDate = startDate;
        }
      }

      return {
        id: lesson.id,
        accountId: lesson.accountId,
        baseLessonId: lesson.baseLessonId,
        releaseOnDate,
        title: lesson.title,
      };
    });
  }

  async update({
    accountId,
    moduleId,
    userId,
    title,
    isActive,
  }: UpdateCourseModuleArgs): Promise<CourseModule> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const module = await this.courseModuleRepository.findOne({
      id: moduleId,
      accountId,
    });

    if (!module) {
      throw AppExceptions.CourseModuleNotFound;
    }

    if (title) module.title = title;
    if (typeof isActive === 'boolean') module.isActive = isActive;
    module.updatedAt = new Date();

    await this.courseModuleRepository.save(module);

    return module;
  }

  async deleteById({
    accountId,
    moduleId,
    userId,
  }: DeleteCourseModuleArgs): Promise<string> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const module = await this.courseModuleRepository.findOne({
      id: moduleId,
      accountId,
    });

    if (!module) {
      throw AppExceptions.CourseModuleNotFound;
    }

    await this.courseModuleRepository.remove(module);

    const allModules = await this.courseModuleRepository.findAll({
      accountId,
      courseVersionId: module.courseVersionId,
      order: {
        sortOrder: 'ASC',
      },
    });

    for (const [index, eachModule] of allModules.entries()) {
      eachModule.sortOrder = index + 1;
      eachModule.updatedAt = new Date();

      await this.courseModuleRepository.save(eachModule);
    }

    return moduleId;
  }

  async changeSortOrder({
    accountId,
    userId,
    courseVersionId,
    modules,
  }: ChangeCourseModuleSortOrderArgs): Promise<string> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    for (const [index, module] of modules.entries()) {
      const isValidModule = await this.courseModuleRepository.findOne({
        id: module.id,
        accountId,
        courseVersionId,
      });

      if (!isValidModule) {
        throw AppExceptions.LessonNotFound;
      }

      isValidModule.sortOrder = index + 1;
      isValidModule.updatedAt = new Date();

      await this.courseModuleRepository.save(isValidModule);
    }

    return 'Sort order has been changed';
  }
}
