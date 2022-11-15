import { User } from '@/modules/users/user.entity';
import { ThreadAnswer } from '../thread-answers.entity';

export interface CreateThreadAnswerArgs {
  accountId: string;
  userId: string;
  threadId: string;
  body: any;
  isAnswer: boolean;
  isInternalNote: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindOneThreadAnswerArgs {
  id?: string;
  accountId?: string;
}

export interface FindAllThreadAnswersArgs {
  accountId?: string;
  threadId?: string;
  role: string;
}

export interface IThreadAnswersRepository {
  create(args: CreateThreadAnswerArgs): Promise<ThreadAnswer>;
  findOne(args: FindOneThreadAnswerArgs): Promise<ThreadAnswer>;
  findAllByThreadIdAndAccountIdAndRole(
    args: FindAllThreadAnswersArgs,
  ): Promise<(ThreadAnswer & User)[]>;
  save(args: ThreadAnswer): Promise<ThreadAnswer>;
  remove(args: ThreadAnswer): Promise<void>;
}
