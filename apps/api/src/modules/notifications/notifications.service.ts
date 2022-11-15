import { AppExceptions } from '@/utils/AppExceptions';
import { Inject, Injectable } from '@nestjs/common';
import { INotificationInterface } from './notification.interface';
import {
  MarkAllNotificationAsReadArgs,
  MarkNotificationAsReadArgs,
} from './types';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepository: INotificationInterface,
  ) { }
  async findAll({ accountId, userId }) {
    const notifications = await this.notificationRepository.findAll({
      accountId,
      userId,
    });

    return notifications.map(notification => ({
      id: notification.id,
      accountId: notification.accountId,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
      data: JSON.stringify(notification.data),
      user: {
        id: notification.userId,
        firstName: notification.firstName,
        lastName: notification.lastName,
        profilePicture: notification.profilePicture,
      },
    }));
  }

  async markAsRead({
    accountId,
    userId,
    notificationId,
  }: MarkNotificationAsReadArgs) {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
      accountId,
      userId,
    });

    if (!notification) {
      throw AppExceptions.NotificationNotFound;
    }

    notification.read = true;
    notification.readAt = new Date();
    notification.updatedAt = new Date();

    await this.notificationRepository.save(notification);

    return notification;
  }

  //@Todo : A discutir a forma que fiz update e como estava antes o código.
  async markAllAsRead({ accountId, userId }: MarkAllNotificationAsReadArgs) {
    await this.notificationRepository.update({
      accountId,
      userId,
      read: true,
      readAt: new Date(),
      updatedAt: new Date(),
    });

    const notifications = await this.notificationRepository.findAll({
      accountId,
      userId,
    });

    return {
      ...notifications,
      data: JSON.stringify(notifications),
    };
  }
}
