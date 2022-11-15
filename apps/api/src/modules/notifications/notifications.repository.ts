import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateArgs,
  FindAllArgs,
  FindOneBy,
  INotificationInterface,
  UpdateArgs,
} from './notification.interface';
import { Notification } from './notifications.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CustomNotificationRepository implements INotificationInterface {
  constructor(
    @InjectRepository(Notification)
    private readonly ormRepository: Repository<Notification>,
  ) {}

  async findAll({
    userId,
    accountId,
  }: FindAllArgs): Promise<(Notification & User)[]> {
    const query = this.ormRepository
      .createQueryBuilder('notifications')
      .select('notifications.id', 'id')
      .addSelect('notifications.account_id', 'accountId')
      .addSelect('notifications.data', 'data')
      .addSelect('notifications.type', 'type')
      .addSelect('notifications.message', 'message')
      .addSelect('notifications.read', 'read')
      .addSelect('notifications.read_at', 'readAt')
      .addSelect('notifications.created_at', 'createdAt')
      .addSelect('users.id', 'userId')
      .addSelect('users.first_name', 'firstName')
      .addSelect('users.last_name', 'lastName')
      .addSelect('users.profile_picture', 'profilePicture')
      .innerJoin('users', 'users', 'users.id = notifications.notified_by')
      .where('notifications.account_id = :accountId', { accountId: accountId })
      .andWhere('notifications.user_id = :userId', { userId: userId });

    return query.getRawMany<Notification & User>();
  }

  async findOneBy(args: FindOneBy): Promise<Notification> {
    return this.ormRepository.findOne({
      where: {
        ...args,
      },
    });
  }

  async create(args: CreateArgs): Promise<Notification> {
    const notificationCreated = this.ormRepository.create({
      ...args,
    });

    return this.save(notificationCreated);
  }

  save(args: Notification): Promise<Notification> {
    return this.ormRepository.save(args);
  }

  async update({
    userId,
    accountId,
    read,
    readAt,
    updatedAt,
  }: UpdateArgs): Promise<void> {
    await this.ormRepository.update(
      {
        userId,
        accountId,
      },
      {
        read,
        readAt,
        updatedAt,
      },
    );
  }
}
