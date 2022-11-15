import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from '../../label.entity';
import {
  CreateLabelArgs,
  FindAllLabelArgs,
  FindOneLabelArgs,
  ILabelRepository,
} from '../label-repository.interface';

@Injectable()
export class CustomLabelRepository implements ILabelRepository {
  constructor(
    @InjectRepository(Label)
    private readonly ormRepository: Repository<Label>,
  ) {}

  async findOne({
    id,
    accountId,
    label,
  }: FindOneLabelArgs): Promise<Label | undefined> {
    let query = this.ormRepository.createQueryBuilder('labels');

    if (id) {
      query = query.andWhere('labels.id = :id', { id });
    }

    if (accountId) {
      query = query.andWhere('labels.account_id = :accountId', { accountId });
    }

    if (label) {
      query = query.andWhere('labels.label = :label', { label });
    }

    const labelFounded = await query.getOne();

    return labelFounded;
  }

  async findAll({ accountId, courseId }: FindAllLabelArgs): Promise<Label[]> {
    let query = this.ormRepository.createQueryBuilder('labels');

    if (accountId) {
      query = query.andWhere('labels.account_id = :accountId', { accountId });
    }
    if (accountId && courseId) {
      query = query.andWhere(
        'labels.id in (select label_id from label_course where course_id = :courseId)',
        { courseId },
      );
    }

    const labels = await query.getMany();

    return labels;
  }

  async create(args: CreateLabelArgs): Promise<Label> {
    const createdLabel = this.ormRepository.create(args);

    const label = await this.ormRepository.save(createdLabel);

    return label;
  }

  async save(args: Label): Promise<Label> {
    const label = await this.ormRepository.save(args);

    return label;
  }
}
