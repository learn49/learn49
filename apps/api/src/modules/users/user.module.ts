import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';
import { SendgridService } from '../../services/sendgrid.service';
import { RecaptchaService } from '../../utils/recaptcha';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRole } from './user-role.entity';
import { Token } from '../tokens/token.entity';
import { Account } from '../accounts/account.entity';
import { CustomUserRepository } from './repositories/typeorm/user.repository';
import { CustomUserRoleRepository } from './repositories/typeorm/user-role.repository';
import { CustomExtensionInstallationRepository } from '../extension-installations/extension-installations.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomExtensionRepository } from '../extensions/extensions.repository';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';
import { Course } from '../courses/courses.entity';
import { CourseModule } from '../course-modules/course-modules.entity';
import { CourseLesson } from '../course-lessons/course-lessons.entity';
import { Extension } from '../extensions/extensions.entity';
import { ExtensionInstallation } from '../extension-installations/extension-installations.entity';
import { CustomCourseModuleRepository } from '../course-modules/repositories/typeorm/course-module.repository';
import { CustomMediaFileRepository } from '../media-file/repositories/typeorm/media-file.repository';
import { MediaFile } from '../media-file/media-file.entity';
import { Enrollment } from '@/modules/enrollment/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      Token,
      Account,
      Course,
      CourseModule,
      CourseLesson,
      Extension,
      Enrollment,
      ExtensionInstallation,
      MediaFile,
    ]),
  ],
  providers: [
    UserResolver,
    UserService,
    SendgridService,
    RecaptchaService,
    CustomFieldExtension,
    {
      provide: 'USER_REPOSITORY',
      useClass: CustomUserRepository,
    },
    {
      provide: 'USER_ROLE_REPOSITORY',
      useClass: CustomUserRoleRepository,
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
      provide: 'COURSE_MODULE_REPOSITORY',
      useClass: CustomCourseModuleRepository,
    },
    {
      provide: 'MEDIA_FILE_REPOSITORY',
      useClass: CustomMediaFileRepository,
    },
  ],
})
export class UserModule { }
