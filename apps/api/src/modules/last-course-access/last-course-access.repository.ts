import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { FindOneArgs, ILastCourseAccess } from './last-course-access.interface';
import { LastCourseAccess } from './last-course-access.entity';

@Injectable()
export class CustomLastCourseAccessRepository implements ILastCourseAccess {
  constructor(
    @InjectRepository(LastCourseAccess)
    private readonly ormRepository: Repository<LastCourseAccess>,
  ) {}

  async findOne({
    accountId,
    courseId,
    userId,
  }: FindOneArgs): Promise<LastCourseAccess> {
    let query = this.ormRepository
      .createQueryBuilder('last_course_access')
      .where('last_course_access.account_id = :accountId', {
        accountId: accountId,
      })
      .andWhere('last_course_access.user_id = :userId', { userId: userId })
      .orderBy('last_course_access.updated_at', 'DESC');

    if (courseId) {
      query = query.andWhere('last_course_access.course_id = :courseId', {
        courseId: courseId,
      });
    }

    return query.getOne();
  }
}
