import { User } from '../users/user.entity';
import { Notification } from './notifications.entity';

export interface FindOneBy {
  id: string;
  accountId: string;
  userId: string;
}

export interface CreateArgs {
  accountId: string;
  userId: string;
  notifiedBy: string;
  read: boolean;
  type: string;
  message: string;
  data: {
    courseId: string;
    threadId: string;
    threadAnswerId: string;
  };
}

export interface UpdateArgs {
  accountId: string;
  userId: string;
  read: boolean;
  readAt: Date;
  updatedAt: Date;
}

export interface FindAllArgs {
  accountId: string;
  userId: string;
}
export interface INotificationInterface {
  findAll(args: FindAllArgs): Promise<(Notification & User)[]>;
  findOneBy(args: FindOneBy): Promise<Notification>;
  save(args: Notification): Promise<Notification>;
  update(args: UpdateArgs): Promise<void>;
  create(args: CreateArgs): Promise<Notification>;
}
