import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from '../../user-role.entity';
import { User } from '../../user.entity';
import {
  IUserRepository,
  CreateUserArgs,
  FindAllArgs,
  FindOneByAccountIdAndEmailArgs,
  FindOneByAccountIdAndUserIdArgs,
} from '../user-repository.interface';

@Injectable()
export class CustomUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async findOneByAccountIdAndEmail({
    accountId,
    email,
  }: FindOneByAccountIdAndEmailArgs): Promise<User | undefined> {
    const jsonWhere = JSON.stringify([{ email }]);

    const user = await this.ormRepository.findOne({
      where: `account_id = '${accountId}' and emails ::jsonb @> '${jsonWhere}'`,
      select: [
        'id',
        'passwd',
        'firstName',
        'lastName',
        'profilePicture',
        'emails',
      ],
    });

    return user;
  }

  async findOneByAccountIdAndUserId({
    accountId,
    userId,
  }: FindOneByAccountIdAndUserIdArgs): Promise<(User & UserRole) | undefined> {
    const query = this.ormRepository
      .createQueryBuilder('users')
      .select('users.id as id')
      .addSelect('passwd', 'passwd')
      .addSelect('first_name', 'firstName')
      .addSelect('profile_picture', 'profilePicture')
      .addSelect('emails', 'emails')
      .innerJoin('user_roles', 'user_roles', 'user_roles.user_id = users.id')
      .where('users.account_id = :accountId and users.id = :userId', {
        accountId,
        userId,
      });

    const user = await query.getRawOne<User & UserRole>();

    return user;
  }

  async findOneByUserId(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { id },
    });

    return user;
  }

  async findAll({
    accountId,
    name,
    limit,
    offset,
  }: FindAllArgs): Promise<User[]> {
    let users = [];

    if (name) {
      users = await this.ormRepository.find({
        where: `account_id = '${accountId}' and (first_name ILike '%${name}%' or last_name Ilike '%${name}%')`,
        select: [
          'id',
          'passwd',
          'firstName',
          'lastName',
          'profilePicture',
          'emails',
        ],
      });
    } else {
      users = await this.ormRepository.find({
        where: {
          accountId,
        },
        skip: offset,
        take: limit,
      });
    }

    return users;
  }

  async count(accountId: string): Promise<number> {
    const totalUsers = await this.ormRepository.count({
      where: {
        accountId,
      },
    });

    return totalUsers;
  }

  async create(args: CreateUserArgs): Promise<User> {
    const createdUser = this.ormRepository.create(args);

    const user = await this.ormRepository.save(createdUser);

    return user;
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.ormRepository.save(user);

    return savedUser;
  }
}
