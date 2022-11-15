import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateArgs,
  FindOneByAccountIdAndUserIdArgs,
  IUserRoleRepository,
} from '../user-role-repository.interface';

import { UserRole } from '../../user-role.entity';

@Injectable()
export class CustomUserRoleRepository implements IUserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly ormRepository: Repository<UserRole>,
  ) {}

  async findOneByAccountIdAndUserId({
    accountId,
    userId,
  }: FindOneByAccountIdAndUserIdArgs): Promise<UserRole | undefined> {
    const userRole = await this.ormRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    return userRole;
  }

  async create(args: CreateArgs): Promise<UserRole> {
    const userRoleCreated = this.ormRepository.create(args);

    const userRole = await this.ormRepository.save(userRoleCreated);

    return userRole;
  }

  async save(args: UserRole): Promise<UserRole> {
    const userRole = await this.ormRepository.save(args);

    return userRole;
  }
}
