import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { User } from '../users/user.entity';
import { OfferCourse } from './offers-course.entity';
import { Offers } from './offers.entity';
import { OffersResolvers } from './offers.resolvers';
import { OffersService } from './offers.service';
import { CustomOfferCourseRepository } from './repositories/typeorm/offer-course.repository';
import { CustomOfferRepository } from './repositories/typeorm/offer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Offers, User, OfferCourse])],
  providers: [
    OffersResolvers,
    OffersService,
    {
      provide: 'OFFER_REPOSITORY',
      useClass: CustomOfferRepository,
    },
    {
      provide: 'OFFER_COURSE_REPOSITORY',
      useClass: CustomOfferCourseRepository,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: CustomUserRepository,
    },
  ],
})
export class OffersModule {}
