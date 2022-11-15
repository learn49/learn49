import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferCourse } from '../../offers-course.entity';
import {
  CreateOfferCourseArgs,
  IOfferCourseRepository,
} from '../offer-course-repository.interface';

@Injectable()
export class CustomOfferCourseRepository implements IOfferCourseRepository {
  constructor(
    @InjectRepository(OfferCourse)
    private readonly ormRepository: Repository<OfferCourse>,
  ) {}

  async create(args: CreateOfferCourseArgs): Promise<OfferCourse> {
    const createdOfferCourse = this.ormRepository.create(args);

    const offerCourse = await this.ormRepository.save(createdOfferCourse);

    return offerCourse;
  }
}
