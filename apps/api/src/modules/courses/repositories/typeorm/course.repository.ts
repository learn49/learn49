import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../courses.entity';
import {
  CreateCourseArgs,
  FindAllCourseArgs,
  FindOneCourseArgs,
  ICourseRepository,
} from '../course-repository.interface';

@Injectable()
export class CustomCourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly ormRepository: Repository<Course>,
  ) { }

  async create(args: CreateCourseArgs): Promise<Course> {
    const createdCourse = this.ormRepository.create(args);
    return await this.ormRepository.save(createdCourse);
  }

  async findOne({
    id,
    accountId,
  }: FindOneCourseArgs): Promise<Course | undefined> {
    let query = this.ormRepository.createQueryBuilder('courses');

    if (id) {
      query = query.andWhere('courses.id = :id', {
        id,
      });
    }

    if (accountId) {
      query = query.andWhere('courses.account_id = :accountId', {
        accountId,
      });
    }

    return await query.getOne();
  }

  async findAll({
    accountId,
    offset,
    limit,
  }: FindAllCourseArgs): Promise<Course[]> {
    let query = this.ormRepository.createQueryBuilder('courses');
    if (accountId) {
      query = query.andWhere('courses.account_id = :accountId', {
        accountId,
      });
    }
    if (limit) query = query.take(limit);
    if (offset) query = query.offset(offset);
    return await query.getMany();
  }

  async count(accountId: string): Promise<number> {
    return await this.ormRepository.count({
      where: {
        accountId,
      },
    });
  }

  async save(args: Course): Promise<Course> {
    return await this.ormRepository.save(args);
  }

  async remove(args: Course): Promise<void> {
    await this.ormRepository.remove(args);
  }
}
