import { OfferCourse } from '../offers-course.entity';

export interface CreateOfferCourseArgs {
  offerId: string;
  accountId: string;
  courseId: string;
  settingsType: string;
  settingsVersionId: string;
  settingsPeriod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOfferCourseRepository {
  create(args: CreateOfferCourseArgs): Promise<OfferCourse>;
}
