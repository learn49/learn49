import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastCourseAccess } from './last-course-access.entity';
import { LastCourseAccessResolvers } from './last-course-access.resolvers';
import { LastCourseAccessService } from './last-course-access.service';

import { CourseLesson } from '@/modules/course-lessons/course-lessons.entity';
import { CourseModule } from '@/modules/course-modules/course-modules.entity';
import { Course } from '@/modules/courses/courses.entity';
import { CustomLastCourseAccessRepository } from './last-course-access.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomCourseModuleRepository } from '../course-modules/repositories/typeorm/course-module.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LastCourseAccess,
      CourseLesson,
      CourseModule,
      Course,
    ]),
  ],

  providers: [
    LastCourseAccessResolvers,
    LastCourseAccessService,
    {
      provide: 'LAST_COURSE_ACCESS_REPOSITORY',
      useClass: CustomLastCourseAccessRepository,
    },
    {
      provide: 'COURSE_REPOSITORY',
      useClass: CustomCourseRepository,
    },
    {
      provide: 'COURSE_MODULE_REPOSITORY',
      useClass: CustomCourseModuleRepository,
    },
  ],
})
export class LastCourseAccessModule {}
