import {
  Resolver,
  Args,
  Query,
  Mutation,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { AuthGuard } from '../../auth/authGuard';
import { Notification } from './dto/notifications';
import { NotificationService } from './notifications.service';
import { User } from '../users/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => [Notification], { name: 'getAllNotifications' })
  async getAllNotifications(
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return await this.notificationService.findAll({ accountId, userId });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Notification, {
    name: 'markNotificationAsRead',
    nullable: true,
  })
  async markNotificationAsRead(
    @Args('accountId') accountId: string,
    @Args('notificationId') notificationId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.notificationService.markAsRead({
      accountId,
      userId,
      notificationId,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Notification, {
    name: 'markAllNotificationsAsRead',
    nullable: true,
  })
  async markAllNotificationsAsRead(
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.notificationService.markAllAsRead({
      accountId,
      userId,
    });
  }

  // @UseGuards(AuthGuard)
  @Subscription(() => Notification, {
    name: 'notificationAdded',
    filter: (payload, variables) =>
      payload.notificationAdded.userId === variables.userId,
  })
  notificationAdded(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator('notificationAdded');
  }
}
