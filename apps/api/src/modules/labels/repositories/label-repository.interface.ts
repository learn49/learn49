import { Label } from '../label.entity';

export interface FindOneLabelArgs {
  id?: string;
  accountId?: string;
  label?: string;
}

export interface FindAllLabelArgs {
  accountId?: string;
  courseId?: string;
}

export interface CreateLabelArgs {
  accountId: string;
  label: string;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILabelRepository {
  findOne(args: FindOneLabelArgs): Promise<Label | undefined>;
  findAll(args: FindAllLabelArgs): Promise<Label[]>;
  create(args: CreateLabelArgs): Promise<Label>;
  save(args: Label): Promise<Label>;
}
