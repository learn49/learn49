import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CourseVersion } from '@/modules/course-versions/course-versions.entity';
import { ICourseVersionRepository } from '../../course-version-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatCourseVersionArgs,
  FindAllCourseVersionArgs,
  FindOneCourseVersionArgs,
} from '@/modules/course-versions/interfaces';

@Injectable()
export class CustomCourseVersionRepository implements ICourseVersionRepository {
  constructor(
    @InjectRepository(CourseVersion)
    private readonly ormRepository: Repository<CourseVersion>,
  ) { }

  async findAll({
    whereRaw,
    accountId,
    courseId,
    limit,
    offset,
    order,
  }: FindAllCourseVersionArgs): Promise<CourseVersion[]> {
    let query = this.ormRepository.createQueryBuilder('course_version');

    if (courseId) {
      query = query.andWhere('course_id = :courseId', {
        courseId,
      });
    }

    if (accountId) {
      query = query.andWhere('account_id = :accountId', {
        accountId,
      });
    }

    if (whereRaw) {
      query = query.where(whereRaw);
    }

    if (limit) {
      query = query.take(limit);
    }

    if (offset) {
      query = query.offset(offset);
    }

    if (order && order.createdAt) {
      query = query.orderBy('created_at', order.createdAt);
    }

    const courseVersions = await query.getMany();

    return courseVersions;
  }

  async findOne({
    accountId,
    courseId,
  }: FindOneCourseVersionArgs): Promise<CourseVersion | undefined> {
    let query = this.ormRepository.createQueryBuilder('course_version');

    if (courseId) {
      query = query.andWhere('course_id = :courseId', {
        courseId,
      });
    }

    if (accountId) {
      query = query.andWhere('account_id = :accountId', {
        accountId,
      });
    }

    const courseVersion = await query.getOne();

    return courseVersion;
  }

  async create(args: CreatCourseVersionArgs): Promise<CourseVersion> {
    const createdCourseVersion = this.ormRepository.create(args);

    const courseVersion = await this.ormRepository.save(createdCourseVersion);

    return courseVersion;
  }

  async count(accountId: string): Promise<number> {
    const totalCount = await this.ormRepository.count({
      where: {
        accountId,
      },
    });

    return totalCount;
  }

  async save(args: CourseVersion): Promise<CourseVersion> {
    const courseVersion = await this.ormRepository.save(args);

    return courseVersion;
  }

  async remove(args: CourseVersion): Promise<void> {
    await this.ormRepository.remove(args);
  }
}
