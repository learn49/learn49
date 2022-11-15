import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateExtensionInstallationArgs,
  FindOneBy,
  IExtensionInstallation,
} from './extension-installations.interface';
import { ExtensionInstallation } from './extension-installations.entity';
import { Extension } from '../extensions/extensions.entity';

@Injectable()
export class CustomExtensionInstallationRepository
  implements IExtensionInstallation {
  constructor(
    @InjectRepository(ExtensionInstallation)
    private readonly ormRepository: Repository<ExtensionInstallation>,
  ) {}

  async create(
    args: CreateExtensionInstallationArgs,
  ): Promise<ExtensionInstallation> {
    const createdExtensionInstallation = this.ormRepository.create({
      ...args,
    });

    return this.ormRepository.save(createdExtensionInstallation);
  }

  async findOneBy(args: FindOneBy): Promise<ExtensionInstallation> {
    return this.ormRepository.findOne({
      where: {
        ...args,
      },
    });
  }

  findOne({
    accountId,
    extensionId,
  }: FindOneBy): Promise<ExtensionInstallation | Extension> {
    const queryExtensionInstallation = this.ormRepository
      .createQueryBuilder('extension_installations')
      .select('extension_installations.extension_id', 'extensionId')
      .addSelect('extension_installations.id', 'id')
      .addSelect('extension_installations.account_id', 'accountId')
      .addSelect('extension_installations.active', 'active')
      .addSelect('extension_installations.settings_values', 'settingsValues')
      .addSelect(
        'extension_installations.permission_values',
        'permissionValues',
      )
      .addSelect('extension_installations.created_at', 'createdAt')
      .addSelect('extension_installations.updated_at', 'updatedAt')

      .addSelect('extensions.name', 'name')
      .innerJoin(
        'extensions',
        'extensions',
        'extensions.id = extension_installations.extension_id',
      )
      .where(
        'extension_installations.account_id = :accountId and extension_installations.extension_id = :extensionId',
        {
          accountId,
          extensionId,
        },
      );

    return queryExtensionInstallation.getRawOne();
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
