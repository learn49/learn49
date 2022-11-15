import { AppExceptions } from '@/utils/AppExceptions';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../users/repositories/user-repository.interface';
import { IOfferCourseRepository } from './repositories/offer-course-repository.interface';
import { IOfferRepository } from './repositories/offer-repository.interface';
import { CreateOffersArgs } from './types';

@Injectable()
export class OffersService {
  constructor(
    @Inject('OFFER_REPOSITORY')
    private readonly offerRepository: IOfferRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    @Inject('OFFER_COURSE_REPOSITORY')
    private readonly offerCourseRepository: IOfferCourseRepository,
  ) { }

  async create({
    accountId,
    extensionId,
    userId,
    name,
    type,
    price,
    sellPage,
    metadata,
    courses,
  }: CreateOffersArgs) {
    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (!user) {
      throw AppExceptions.AccessDenied;
    }

    const offer = await this.offerRepository.create({
      extensionId,
      accountId,
      name,
      price,
      type,
      sellPage,
      metadata: JSON.parse(metadata),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const offerCoursesPromise = courses.map(async course => {
      return this.offerCourseRepository.create({
        offerId: offer.id,
        accountId,
        courseId: course.id,
        settingsPeriod: course.settingsPeriod,
        settingsType: course.settingsType,
        settingsVersionId: course.settingsVersionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await Promise.all(offerCoursesPromise);

    return offer;
  }
}
