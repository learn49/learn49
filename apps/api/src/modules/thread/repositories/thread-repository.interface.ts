import { User } from '@/modules/users/user.entity';
import { Thread } from '../thread.entity';

export interface CreateThreadArgs {
  accountId: string;
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  body: any;
  tags: any;
  isSolved: boolean;
  isTicket: boolean;
  isPinned: boolean;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FineOneThreadArgs {
  id?: string;
  accountId?: string;
  courseId?: string;
}

export interface FindAllThreadArgs {
  limit?: number;
  offset?: number;
  accountId?: string;
  courseId?: string;
  courseIds?: string[];
  lessonId?: string;
  isTicket?: boolean;
  filter?: string;
  myTickets?: boolean;
  userId?: string;
  role?: string;
  title?: string;
  order?: {
    createdAt: 'ASC' | 'DESC';
  };
}

export interface CountThreadArgs {
  accountId?: string;
  isTicket?: boolean;
  courseId?: string;
  lessonId?: string;
  courseIds?: string[];
  filter?: string;
  isClosed?: boolean;
}

export interface IThreadRepository {
  create(args: CreateThreadArgs): Promise<Thread>;
  save(args: Thread): Promise<Thread>;
  findOne(args: FineOneThreadArgs): Promise<Thread | undefined>;
  findAll(args: FindAllThreadArgs): Promise<(User & Thread)[]>;
  count(args: CountThreadArgs): Promise<number>;
  remove(args: Thread): Promise<void>;
}
