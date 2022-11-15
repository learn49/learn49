import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModule } from '../../course-modules.entity';
import {
  CountCourseModuleArgs,
  CreateCourseModuleArgs,
  FindAllCourseModuleArgs,
  FindOneCourseModuleArgs,
  ICourseModuleRepository,
} from '../course-module-repository.interface';

@Injectable()
export class CustomCourseModuleRepository implements ICourseModuleRepository {
  constructor(
    @InjectRepository(CourseModule)
    private readonly ormRepository: Repository<CourseModule>,
  ) {}

  async create(args: CreateCourseModuleArgs): Promise<CourseModule> {
    const createdCourseModule = this.ormRepository.create(args);

    const courseModule = await this.ormRepository.save(createdCourseModule);

    return courseModule;
  }

  async findOne({
    id,
    accountId,
    courseVersionId,
    sortOrder,
    isActive,
    order,
  }: FindOneCourseModuleArgs): Promise<CourseModule | undefined> {
    let query = this.ormRepository
      .createQueryBuilder('course_modules')
      .where('course_modules.account_id = :accountId', {
        accountId,
      });

    if (id) {
      query = query.andWhere('course_modules.id = :id', {
        id,
      });
    }

    if (courseVersionId) {
      query = query.andWhere(
        'course_modules.course_version_id = :courseVersionId',
        {
          courseVersionId,
        },
      );
    }

    if (sortOrder) {
      if (typeof sortOrder === 'number') {
        query = query.andWhere('course_modules.sort_order = :sortOrder', {
          sortOrder,
        });
      } else {
        query = query.andWhere(
          `course_modules.sort_order ${
            sortOrder.direction === 'GT' ? '>' : '<'
          } :sortOrder`,
          {
            sortOrder: sortOrder.value,
          },
        );
      }
    }

    if (typeof isActive === 'boolean') {
      query = query.andWhere('course_modules.is_active = :isActive', {
        isActive,
      });
    }

    if (order && order.sortOrder) {
      query = query.orderBy('course_modules.sort_order', order.sortOrder);
    }

    const courseModule = await query.getOne();

    return courseModule;
  }

  async findAll({
    accountId,
    courseVersionId,
    isActive,
    limit,
    offset,
    order,
  }: FindAllCourseModuleArgs): Promise<CourseModule[]> {
    let query = this.ormRepository
      .createQueryBuilder('course_modules')
      .where('course_modules.account_id = :accountId', {
        accountId,
      })
      .andWhere('course_modules.course_version_id = :courseVersionId', {
        courseVersionId,
      });

    if (typeof isActive === 'boolean') {
      query = query.andWhere('course_modules.is_active = :isActive', {
        isActive,
      });
    }

    if (limit) {
      query = query.take(limit);
    }

    if (offset) {
      query = query.offset(offset);
    }

    if (order && order.sortOrder) {
      query = query.orderBy('course_modules.sort_order', order.sortOrder);
    }

    const courseModules = await query.getMany();

    return courseModules;
  }

  async count({
    accountId,
    courseVersionId,
  }: CountCourseModuleArgs): Promise<number> {
    const totalCount = await this.ormRepository.count({
      where: {
        accountId,
        courseVersionId,
      },
    });

    return totalCount;
  }

  async save(args: CourseModule): Promise<CourseModule> {
    const courseModule = await this.ormRepository.save(args);

    return courseModule;
  }

  async remove(args: CourseModule): Promise<void> {
    await this.ormRepository.remove(args);
  }
}
