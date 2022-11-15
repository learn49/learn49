import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseLesson } from '../course-lessons/course-lessons.entity';
import { CourseModule } from '../course-modules/course-modules.entity';
import { CustomCourseModuleRepository } from '../course-modules/repositories/typeorm/course-module.repository';
import { Course } from '../courses/courses.entity';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomExtensionInstallationRepository } from '../extension-installations/extension-installations.repository';
import { ExtensionInstallation } from '../extension-installations/extension-installations.entity';
import { MediaFile } from '../media-file/media-file.entity';
import { CustomMediaFileRepository } from '../media-file/repositories/typeorm/media-file.repository';
import { CustomUserRoleRepository } from '../users/repositories/typeorm/user-role.repository';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { UserRole } from '../users/user-role.entity';
import { User } from '../users/user.entity';
import { Extension } from './extensions.entity';
import { CustomExtensionRepository } from './extensions.repository';
import { ExtensionsResolvers } from './extensions.resolvers';
import { ExtensionService } from './extensions.service';
import { CustomFieldExtension } from './providers/custom-field.extension';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Extension,
      ExtensionInstallation,
      UserRole,
      Extension,
      CourseLesson,
      Course,
      CourseModule,
      MediaFile,
    ]),
  ],
  providers: [
    ExtensionsResolvers,
    ExtensionService,
    CustomFieldExtension,
    {
      provide: 'USER_ROLE_REPOSITORY',
      useClass: CustomUserRoleRepository,
    },
    {
      provide: 'EXTENSION_REPOSITORY',
      useClass: CustomExtensionRepository,
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
      provide: 'COURSE_MODULE_REPOSITORY',
      useClass: CustomCourseModuleRepository,
    },
    {
      provide: 'MEDIA_FILE_REPOSITORY',
      useClass: CustomMediaFileRepository,
    },
  ],
})
export class ExtensionsModule { }
