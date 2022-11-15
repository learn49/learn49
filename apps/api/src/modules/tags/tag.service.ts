import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository } from './repositories/tag-repositories.interface';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @Inject('TAG_REPOSITORY')
    private readonly tagRepository: ITagRepository,
  ) {}

  async create({
    accountId,
    courseId,
    name,
  }: Pick<Tag, 'accountId' | 'courseId' | 'name'>): Promise<Tag> {
    const tag = await this.tagRepository.create({
      accountId,
      courseId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return tag;
  }

  async findAll({
    accountId,
    courseId,
    name,
  }: Pick<Tag, 'accountId' | 'courseId' | 'name'>) {
    const tags = await this.tagRepository.findAll({
      accountId,
      courseId,
      name,
    });

    return tags;
  }
}
