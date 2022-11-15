import { AppExceptions } from '@/utils/AppExceptions';
import { Inject, Injectable } from '@nestjs/common';
import { Label } from './label.entity';
import { ILabelRepository } from './repositories/label-repository.interface';
import { CreateLabelArgs, UpdateLabelArgs } from './types';

@Injectable()
export class LabelService {
  constructor(
    @Inject('LABEL_REPOSITORY')
    private readonly labelRepository: ILabelRepository,
  ) { }

  async create({
    accountId,
    label,
    isPrivate,
  }: CreateLabelArgs): Promise<Label> {
    const isExistingLabel = await this.labelRepository.findOne({
      accountId,
      label,
    });

    if (isExistingLabel) {
      throw AppExceptions.LabelNotFound;
    }

    const createdLabel = await this.labelRepository.create({
      accountId,
      label,
      isPrivate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return createdLabel;
  }

  async findByAccount({ accountId }): Promise<Label[]> {
    const labels = await this.labelRepository.findAll({
      accountId,
    });

    return labels;
  }

  async findByCourse({ accountId, courseId }): Promise<Label[]> {
    const labels = await this.labelRepository.findAll({
      accountId,
      courseId,
    });

    return labels;
  }

  async update({
    accountId,
    labelId,
    label,
    isPrivate,
  }: UpdateLabelArgs): Promise<Label> {
    const labelToUpdate = await this.labelRepository.findOne({
      accountId,
      id: labelId,
    });

    if (!labelToUpdate) {
      throw AppExceptions.LabelNotFound;
    }

    if (typeof labelToUpdate.isPrivate === 'boolean')
      labelToUpdate.isPrivate = isPrivate;
    if (labelToUpdate.label) labelToUpdate.label = label;
    labelToUpdate.updatedAt = new Date();

    await this.labelRepository.save(labelToUpdate);

    return labelToUpdate;
  }
}
