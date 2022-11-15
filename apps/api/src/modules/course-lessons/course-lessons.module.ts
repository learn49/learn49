import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseService } from '@/modules/courses/courses.service';
import { CourseLessonResolver } from './course-lessons.resolvers';
import { CourseLessonService } from './course-lessons.service';

import { CourseLesson } from './course-lessons.entity';
import { LessonProgress } from './lesson-progress.entity';
import { UserRole } from '@/modules/users/user-role.entity';
import { Enrollment } from '@/modules/enrollment/enrollment.entity';
import { CourseModule } from '@/modules/course-modules/course-modules.entity';
import { LastCourseAccess } from '@/modules/last-course-access/last-course-access.entity';
import { Course } from '../courses/courses.entity';
import { CourseVersion } from '../course-versions/course-versions.entity';
import { ModuleProxy } from '../courses/module-proxy.entity';
import { LessonProxy } from '../courses/lesson-proxy.entity';
import { CustomCourseVersionRepository } from '../course-versions/repositories/repositories/typeorm/course-version.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomCourseModuleRepository } from '../course-modules/repositories/typeorm/course-module.repository';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { CustomExtensionInstallationRepository } from '../extension-installations/extension-installations.repository';
import { CustomExtensionRepository } from '../extensions/extensions.repository';
import { User } from '../users/user.entity';
import { ExtensionInstallation } from '../extension-installations/extension-installations.entity';
import { Extension } from '../extensions/extensions.entity';
import { CustomMediaFileRepository } from '../media-file/repositories/typeorm/media-file.repository';
import { MediaFile } from '../media-file/media-file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseLesson,
      CourseModule,
      UserRole,
      LastCourseAccess,
      LessonProgress,
      Enrollment,
      Course,
      CourseVersion,
      ModuleProxy,
      LessonProxy,
      User,
      Extension,
      ExtensionInstallation,
      MediaFile,
    ]),
  ],
  providers: [
    CourseLessonResolver,
    CourseService,
    CourseLessonService,
    CustomFieldExtension,
    {
      provide: 'COURSE_VERSION_REPOSITORY',
      useClass: CustomCourseVersionRepository,
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
      provide: 'USER_REPOSITORY',
      useClass: CustomUserRepository,
    },
    {
      provide: 'EXTENSION_INSTALLATION_REPOSITORY',
      useClass: CustomExtensionInstallationRepository,
    },
    {
      provide: 'EXTENSION_REPOSITORY',
      useClass: CustomExtensionRepository,
    },
    {
      provide: 'MEDIA_FILE_REPOSITORY',
      useClass: CustomMediaFileRepository,
    },
  ],
})
export class CourseLessonModule { }
