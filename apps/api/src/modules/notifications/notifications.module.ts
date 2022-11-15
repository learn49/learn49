import { Module } from '@nestjs/common';
import { NotificationResolver } from './notifications.resolvers';
import { NotificationService } from './notifications.service';

import { Notification } from './notifications.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomNotificationRepository } from './notifications.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationResolver,
    NotificationService,
    {
      provide: 'NOTIFICATION_REPOSITORY',
      useClass: CustomNotificationRepository,
    },
  ],
})
export class NotificationModule {}
