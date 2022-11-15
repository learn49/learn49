import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRole } from '@/modules/users/user-role.entity';
import { CourseModule } from './course-modules.entity';

import { CourseModuleResolver } from './course-modules.resolvers';
import { CourseModuleService } from './course-modules.service';
import { CourseLesson } from '../course-lessons/course-lessons.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { CustomCourseModuleRepository } from './repositories/typeorm/course-module.repository';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { CustomExtensionInstallationRepository } from '../extension-installations/extension-installations.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomExtensionRepository } from '../extensions/extensions.repository';
import { Extension } from '../extensions/extensions.entity';
import { ExtensionInstallation } from '../extension-installations/extension-installations.entity';
import { User } from '../users/user.entity';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';
import { Course } from '../courses/courses.entity';
import { CustomMediaFileRepository } from '../media-file/repositories/typeorm/media-file.repository';
import { MediaFile } from '../media-file/media-file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseModule,
      UserRole,
      CourseLesson,
      Enrollment,
      Extension,
      ExtensionInstallation,
      User,
      MediaFile,
    ]),
  ],
  providers: [
    CourseModuleResolver,
    CourseModuleService,
    CustomFieldExtension,
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
      provide: 'COURSE_REPOSITORY',
      useClass: CustomCourseRepository,
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
export class CourseModulesModule { }
