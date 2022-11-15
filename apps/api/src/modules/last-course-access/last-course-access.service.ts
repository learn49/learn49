import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseLesson } from '../course-lessons/course-lessons.entity';
import { AppExceptions } from '../../utils/AppExceptions';
import { ILastCourseAccess } from './last-course-access.interface';
import { ICourseRepository } from '../courses/repositories/course-repository.interface';
import { ICourseModuleRepository } from '../course-modules/repositories/course-module-repository.interface';
import { FindLastCourseAccessArgs } from './types';

@Injectable()
export class LastCourseAccessService {
  constructor(
    @Inject('LAST_COURSE_ACCESS_REPOSITORY')
    private readonly lastCourseAccessRepository: ILastCourseAccess,
    @InjectRepository(CourseLesson)
    private readonly courseLessonRepository: Repository<CourseLesson>,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepository: ICourseRepository,
    @Inject('COURSE_MODULE_REPOSITORY')
    private readonly courseModuleRepository: ICourseModuleRepository,
  ) { }

  async findOne({ accountId, userId, courseId }: FindLastCourseAccessArgs) {
    const lastCourseAccess = await this.lastCourseAccessRepository.findOne({
      accountId,
      userId,
      courseId,
    });

    if (!lastCourseAccess) {
      return null;
    }

    const course = await this.courseRepository.findOne({
      id: lastCourseAccess.courseId,
      accountId,
    });

    if (!course) {
      throw AppExceptions.CourseNotFound;
    }

    const courseLesson = await this.courseLessonRepository.findOne({
      where: {
        id: lastCourseAccess.lessonId,
        accountId,
      },
    });

    if (!courseLesson) {
      throw AppExceptions.LessonNotFound;
    }

    const courseModule = await this.courseModuleRepository.findOne({
      id: lastCourseAccess.moduleId,
      accountId,
    });

    if (!courseModule) {
      throw AppExceptions.CourseModuleNotFound;
    }

    return {
      id: lastCourseAccess.id,
      courseId: lastCourseAccess.courseId,
      courseVersionId: lastCourseAccess.courseVersionId,
      lessonId: lastCourseAccess.lessonId,
      courseTitle: course.title,
      moduleTitle: courseModule.title,
      lessonTitle: courseLesson.title,
      lastAccess: lastCourseAccess.updatedAt,
    };
  }
}
