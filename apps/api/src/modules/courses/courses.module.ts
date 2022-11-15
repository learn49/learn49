import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseLesson } from '../course-lessons/course-lessons.entity';
import { LessonProgress } from '../course-lessons/lesson-progress.entity';
import { CustomCourseModuleRepository } from '../course-modules/repositories/typeorm/course-module.repository';
import { CourseVersion } from '../course-versions/course-versions.entity';
import { CustomCourseVersionRepository } from '../course-versions/repositories/repositories/typeorm/course-version.repository';
import { Enrollment } from '../enrollment/enrollment.entity';
import { CustomExtensionInstallationRepository } from '../extension-installations/extension-installations.repository';
import { ExtensionInstallation } from '../extension-installations/extension-installations.entity';
import { Extension } from '../extensions/extensions.entity';
import { CustomExtensionRepository } from '../extensions/extensions.repository';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { UserRole } from '../users/user-role.entity';
import { User } from '../users/user.entity';
import { Course } from './courses.entity';
import { CourseResolver } from './courses.resolvers';
import { CourseService } from './courses.service';
import { LessonProxy } from './lesson-proxy.entity';
import { ModuleProxy } from './module-proxy.entity';
import { CustomCourseRepository } from './repositories/typeorm/course.repository';
import { CourseModule } from '@/modules/course-modules/course-modules.entity';
import { CustomMediaFileRepository } from '../media-file/repositories/typeorm/media-file.repository';
import { MediaFile } from '../media-file/media-file.entity';
import { LabelService } from '../labels/label.service';
import { Label } from '../labels/label.entity';
import { CustomLabelRepository } from '../labels/repositories/typeorm/label.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRole,
      Course,
      CourseVersion,
      Enrollment,
      ModuleProxy,
      Label,
      LessonProxy,
      LessonProgress,
      CourseModule,
      CourseLesson,
      Extension,
      ExtensionInstallation,
      User,
      MediaFile,
    ]),
  ],
  providers: [
    CourseResolver,
    CourseService,
    CustomFieldExtension,
    LabelService,
    {
      provide: 'COURSE_VERSION_REPOSITORY',
      useClass: CustomCourseVersionRepository,
    },
    {
      provide: 'COURSE_REPOSITORY',
      useClass: CustomCourseRepository,
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
      provide: 'EXTENSION_REPOSITORY',
      useClass: CustomExtensionRepository,
    },
    {
      provide: 'MEDIA_FILE_REPOSITORY',
      useClass: CustomMediaFileRepository,
    },
    {
      provide: 'LABEL_REPOSITORY',
      useClass: CustomLabelRepository,
    },
  ],
})
export class MainCourseModule { }
