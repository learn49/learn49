import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import {
  CreateExtensionArgs,
  FindAllExtensionArgs,
  IExtensionsRepository,
} from './extensions.interface';
import { Extension } from './extensions.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomExtensionRepository implements IExtensionsRepository {
  constructor(
    @InjectRepository(Extension)
    private readonly extensionRepository: Repository<Extension>,
  ) {}
  async findAll({ id }: FindAllExtensionArgs): Promise<Extension[]> {
    let query = this.extensionRepository
      .createQueryBuilder('extensions')
      .select('extensions.id', 'id')
      .addSelect('extensions.name', 'name')
      .addSelect('extensions.user_id', 'userId')
      .addSelect('extensions.created_at', 'createdAt')
      .addSelect('extensions.updated_at', 'updatedAt')
      .addSelect('extensions.version', 'version')
      .addSelect('extensions.permissions', 'permissions')
      .addSelect('extensions.settings', 'settings')
      .addSelect('extensions.scopes', 'scopes')
      .addSelect('extensions.developer_id', 'developerId')
      .addSelect('extension_installations.id', 'installed')
      .addSelect('extension_installations.active', 'active')
      .leftJoin(
        'extension_installations',
        'extension_installations',
        'extensions.id = extension_installations.extension_id',
      )
      .orderBy('extension_installations.active', 'ASC');

    if (id) {
      query = query.andWhere('extensions.id = :id', {
        id,
      });
    }

    return query.getRawMany();
  }
  async create(input: CreateExtensionArgs): Promise<Extension> {
    const createdExtension = this.extensionRepository.create({
      ...input,
    });

    await this.extensionRepository.save(createdExtension);

    return createdExtension;
  }
}
