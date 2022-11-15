import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from '../course-modules/course-modules.entity';
import { UserRole } from '../users/user-role.entity';
import { CourseVersion } from './course-versions.entity';
import { CourseVersionResolver } from './course-versions.resolvers';
import { CourseVersionService } from './course-versions.service';
import { CustomCourseVersionRepository } from './repositories/repositories/typeorm/course-version.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CourseVersion, UserRole, CourseModule])],
  providers: [
    CourseVersionResolver,
    CourseVersionService,
    {
      provide: 'COURSE_VERSION_REPOSITORY',
      useClass: CustomCourseVersionRepository,
    },
  ],
})
export class CourseVersionModule {}
