import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateEnrollmentArgs,
  FindOneArgs,
  FindOneByArgs,
  IEnrollmentRepository,
} from './enrollment.interface';
import { Enrollment } from './enrollment.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';

@Injectable()
export class CustomEnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectRepository(Enrollment)
    private readonly ormRepository: Repository<Enrollment>,
  ) {}

  async find({
    accountId,
    courseId,
  }: FindOneArgs): Promise<Enrollment[] | User[] | Course[]> {
    const queryEnrollment = this.ormRepository
      .createQueryBuilder('enrollments')
      .select('enrollments.id', 'id')
      .addSelect('enrollments.user_id', 'userId')
      .addSelect('enrollments.course_id', 'courseId')
      .addSelect('enrollments.course_version_id', 'courseVersionId')
      .addSelect('enrollments.account_id', 'accountId')
      .addSelect('enrollments.start_date', 'startDate')
      .addSelect('enrollments.type', 'type')
      .addSelect('enrollments.status', 'status')
      .addSelect('enrollments.end_date', 'endDate')
      .addSelect('enrollments.created_at', 'createdAt')
      .addSelect('users.first_name', 'firstName')
      .addSelect('users.last_name', 'lastName')
      .addSelect('courses.title', 'title')
      .addSelect('course_versions.name', 'name')
      .innerJoin('users', 'users', 'enrollments.user_id = users.id')
      .innerJoin('courses', 'courses', 'enrollments.course_id = courses.id')
      .leftJoin(
        'course_versions',
        'course_versions',
        'enrollments.course_version_id = course_versions.id',
      )
      .where('enrollments.account_id = :accountId', {
        accountId,
      })
      .andWhere('enrollments.course_id = :courseId', {
        courseId,
      });

    return queryEnrollment.getRawMany<User & Course & Enrollment>();
  }

  async create(args: CreateEnrollmentArgs): Promise<Enrollment> {
    const createdEnrollment = this.ormRepository.create({
      ...args,
    });

    return await this.ormRepository.save(createdEnrollment);
  }

  async findOneBy(args: FindOneByArgs): Promise<Enrollment> {
    return this.ormRepository.findOne({
      where: {
        ...args,
      },
    });
  }

  async save(args: Enrollment): Promise<Enrollment> {
    return this.ormRepository.save(args);
  }
}
