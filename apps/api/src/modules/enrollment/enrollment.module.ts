import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SendgridService } from '@/services/sendgrid.service';
import { EnrollmentResolver } from './enrollment.resolvers';
import { EnrollmentService } from './enrollment.service';

import { Enrollment } from './enrollment.entity';
import { UserRole } from '@/modules/users/user-role.entity';
import { User } from '@/modules/users/user.entity';
import { Course } from '@/modules/courses/courses.entity';
import { Token } from '@/modules/tokens/token.entity';
import { CustomEnrollmentRepository } from './enrollment.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, User, UserRole, Course, Token]),
  ],
  providers: [
    EnrollmentResolver,
    EnrollmentService,
    SendgridService,
    {
      provide: 'ENROLLMENT_REPOSITORY',
      useClass: CustomEnrollmentRepository,
    },
    {
      provide: 'COURSE_REPOSITORY',
      useClass: CustomCourseRepository,
    },
  ],
})
export class EnrollmentModule {}
