import { Inject, Injectable } from '@nestjs/common';
import { AppExceptions } from '../../utils/AppExceptions';

import {
  CreateExtensionArgs,
  IExtensionsRepository,
} from './extensions.interface';
import { IUserRoleRepository } from '../users/repositories/user-role-repository.interface';

@Injectable()
export class ExtensionService {
  constructor(
    @Inject('USER_ROLE_REPOSITORY')
    private readonly userRoleRepository: IUserRoleRepository,
    @Inject('EXTENSION_REPOSITORY')
    private readonly extensionRepository: IExtensionsRepository,
  ) { }

  async create({
    accountId,
    userId,
    name,
    developerId,
    version,
    permissions,
    settings,
    scopes,
  }: CreateExtensionArgs) {
    const userRole = await this.userRoleRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    return this.extensionRepository.create({
      userId,
      name,
      developerId,
      version,
      permissions,
      settings,
      scopes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll() {
    return this.extensionRepository.findAll();
  }
}
