import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThreadResolver } from './thread.resolvers';
import { ThreadService } from './thread.service';
import { CourseLessonService } from '../course-lessons/course-lessons.service';
import { CourseService } from '../courses/courses.service';
import { SendgridService } from '../../services/sendgrid.service';
import { User } from '@/modules/users/user.entity';
import { UserRole } from '@/modules/users/user-role.entity';
import { Course } from '@/modules/courses/courses.entity';
import { CourseModule } from '@/modules/course-modules/course-modules.entity';
import { LastCourseAccess } from '@/modules/last-course-access/last-course-access.entity';
import { Enrollment } from '@/modules/enrollment/enrollment.entity';
import { CourseLesson } from '@/modules/course-lessons/course-lessons.entity';
import { LessonProgress } from '@/modules/course-lessons/lesson-progress.entity';
import { ThreadAnswer } from '@/modules/thread-answers/thread-answers.entity';
import { Thread } from './thread.entity';
import { CourseVersion } from '../course-versions/course-versions.entity';
import { ModuleProxy } from '../courses/module-proxy.entity';
import { LessonProxy } from '../courses/lesson-proxy.entity';
import { CustomThreadAnswerRepository } from '../thread-answers/repositories/typeorm/thread-answers.repository';
import { CustomThreadRepository } from './repositories/typeorm/thread.repository';
import { CustomCourseVersionRepository } from '../course-versions/repositories/repositories/typeorm/course-version.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomCourseModuleRepository } from '../course-modules/repositories/typeorm/course-module.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Thread,
      Enrollment,
      User,
      Course,
      ThreadAnswer,
      CourseLesson,
      CourseModule,
      User,
      UserRole,
      LastCourseAccess,
      LessonProgress,
      CourseVersion,
      ModuleProxy,
      LessonProxy,
    ]),
  ],
  providers: [
    ThreadResolver,
    ThreadService,
    SendgridService,
    CourseService,
    CourseLessonService,
    {
      provide: 'THREAD_ANSWER_REPOSITORY',
      useClass: CustomThreadAnswerRepository,
    },
    {
      provide: 'THREAD_REPOSITORY',
      useClass: CustomThreadRepository,
    },
    {
      provide: 'COURSE_REPOSITORY',
      useClass: CustomCourseRepository,
    },
    {
      provide: 'COURSE_MODULE_REPOSITORY',
      useClass: CustomCourseModuleRepository,
    },
    {
      provide: 'COURSE_VERSION_REPOSITORY',
      useClass: CustomCourseVersionRepository,
    },
  ],
})
export class ThreadModule {}
