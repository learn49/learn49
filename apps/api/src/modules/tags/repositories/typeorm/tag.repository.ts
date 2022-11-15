import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../tag.entity';
import {
  CreateTagArgs,
  FindAllTagsArgs,
  ITagRepository,
} from '../tag-repositories.interface';

@Injectable()
export class CustomTagRepository implements ITagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly ormRepository: Repository<Tag>,
  ) {}

  async create(args: CreateTagArgs): Promise<Tag> {
    const tagCreated = this.ormRepository.create(args);

    const tag = await this.ormRepository.save(tagCreated);

    return tag;
  }

  async findAll({
    accountId,
    courseId,
    name,
  }: FindAllTagsArgs): Promise<Tag[]> {
    let query = this.ormRepository.createQueryBuilder('tag');

    if (accountId) {
      query = query.andWhere('tag.account_id = :accountId', { accountId });
    }

    if (courseId) {
      query = query.andWhere('tag.course_id = :courseId', { courseId });
    }

    if (name) {
      query.andWhere('LOWER(tag.name) like :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    const tags = await query.getMany();

    return tags;
  }
}
