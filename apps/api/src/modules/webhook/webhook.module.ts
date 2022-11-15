import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { SendgridService } from '@/services/sendgrid.service';
import { UserService } from '@/modules/users/user.service';
import { EnrollmentService } from '@/modules/enrollment/enrollment.service';
import { CourseModule } from '@/modules/course-modules/course-modules.entity';
import { UserRole } from '@/modules/users/user-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseLesson } from '@/modules/course-lessons/course-lessons.entity';
import { Enrollment } from '@/modules/enrollment/enrollment.entity';
import { Extension } from '@/modules/extensions/extensions.entity';
import { ExtensionInstallation } from '@/modules/extension-installations/extension-installations.entity';
import { Token } from '@/modules/tokens/token.entity';
import { Offers } from '../offers/offers.entity';
import { OfferCourse } from '../offers/offers-course.entity';

import { ExtensionInstallationWebhook } from '@/modules/extension-installations/extension-installations-webhook.entity';

import { User } from '@/modules/users/user.entity';
import { Course } from '@/modules/courses/courses.entity';
import { Label } from '../labels/label.entity';
import { CustomEnrollmentRepository } from '../enrollment/enrollment.repository';
import { WebhookTesteService } from './webhookTeste.service';
import { CustomOfferRepository } from '../offers/repositories/typeorm/offer.repository';
import { CustomCourseRepository } from '../courses/repositories/typeorm/course.repository';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { CustomUserRoleRepository } from '../users/repositories/typeorm/user-role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseModule,
      User,
      UserRole,
      CourseLesson,
      Token,
      Course,
      Enrollment,
      Extension,
      ExtensionInstallation,
      ExtensionInstallationWebhook,
      Course,
      Token,
      Offers,
      OfferCourse,
      Label,
    ]),
  ],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    WebhookTesteService,
    SendgridService,
    UserService,
    EnrollmentService,
    {
      provide: 'OFFER_REPOSITORY',
      useClass: CustomOfferRepository,
    },
    {
      provide: 'ENROLLMENT_REPOSITORY',
      useClass: CustomEnrollmentRepository,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: CustomUserRepository,
    },
    {
      provide: 'USER_ROLE_REPOSITORY',
      useClass: CustomUserRoleRepository,
    },
    {
      provide: 'COURSE_REPOSITORY',
      useClass: CustomCourseRepository,
    },
  ],
})
export class WebhookModule {}
