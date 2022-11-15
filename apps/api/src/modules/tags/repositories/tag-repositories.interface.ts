import { Tag } from '../tag.entity';

export interface CreateTagArgs {
  accountId: string;
  courseId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindAllTagsArgs {
  accountId?: string;
  courseId?: string;
  name?: string;
}

export interface ITagRepository {
  create(args: CreateTagArgs): Promise<Tag>;
  findAll(args: FindAllTagsArgs): Promise<Tag[]>;
}
