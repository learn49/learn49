import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadAnswerResolver } from './thread-answers.resolvers';
import { ThreadAnswerService } from './thread-answers.service';
import { ThreadAnswer } from './thread-answers.entity';
import { Notification } from '../notifications/notifications.entity';
import { Thread } from '../thread/thread.entity';
import { CustomThreadAnswerRepository } from './repositories/typeorm/thread-answers.repository';
import { CustomThreadRepository } from '../thread/repositories/typeorm/thread.repository';
import { CustomNotificationRepository } from '../notifications/notifications.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ThreadAnswer, Notification, Thread])],
  providers: [
    ThreadAnswerResolver,
    ThreadAnswerService,
    {
      provide: 'THREAD_ANSWER_REPOSITORY',
      useClass: CustomThreadAnswerRepository,
    },
    {
      provide: 'THREAD_REPOSITORY',
      useClass: CustomThreadRepository,
    },
    {
      provide: 'NOTIFICATION_REPOSITORY',
      useClass: CustomNotificationRepository,
    },
  ],
})
export class ThreadAnswerModule {}
