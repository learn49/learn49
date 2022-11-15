import { User } from '@/modules/users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThreadAnswer } from '../../thread-answers.entity';
import {
  CreateThreadAnswerArgs,
  FindAllThreadAnswersArgs,
  FindOneThreadAnswerArgs,
  IThreadAnswersRepository,
} from '../thread-answers-repository.interface';

@Injectable()
export class CustomThreadAnswerRepository implements IThreadAnswersRepository {
  constructor(
    @InjectRepository(ThreadAnswer)
    private readonly ormRepository: Repository<ThreadAnswer>,
  ) {}

  async create(args: CreateThreadAnswerArgs): Promise<ThreadAnswer> {
    const createdThreadAnswer = this.ormRepository.create(args);

    const threadAnswer = await this.ormRepository.save(createdThreadAnswer);

    return threadAnswer;
  }

  async findOne({
    id,
    accountId,
  }: FindOneThreadAnswerArgs): Promise<ThreadAnswer> {
    let query = this.ormRepository.createQueryBuilder('thread_answers');

    if (id) {
      query = query.andWhere('thread_answers.id = : id', { id });
    }

    if (accountId) {
      query = query.andWhere('thread_answers.account_id = : accountId', {
        accountId,
      });
    }

    const threadAnswer = await query.getOne();

    return threadAnswer;
  }

  async findAllByThreadIdAndAccountIdAndRole({
    threadId,
    accountId,
    role,
  }: FindAllThreadAnswersArgs): Promise<(ThreadAnswer & User)[]> {
    let query = this.ormRepository
      .createQueryBuilder('thread_answers')
      .select('thread_answers.id', 'id')
      .addSelect('thread_answers.body', 'body')
      .addSelect('thread_answers.is_answer', 'isAnswer')
      .addSelect('thread_answers.is_internal_note', 'isInternalNote')
      .addSelect('thread_answers.created_at', 'createdAt')
      .addSelect('thread_answers.thread_id', 'threadId')
      .addSelect('users.id', 'userId')
      .addSelect('users.first_name', 'firstName')
      .addSelect('users.last_name', 'lastName')
      .addSelect('users.profile_picture', 'profilePicture')
      .innerJoin('users', 'users', 'users.id = thread_answers.user_id')
      .where('thread_answers.thread_id = :threadId', { threadId })
      .andWhere('thread_answers.account_id = :accountId', { accountId })
      .orderBy('is_answer', 'DESC')
      .addOrderBy('thread_answers.created_at', 'ASC');

    if (role == 'user') {
      query = query.andWhere('thread_answers.is_internal_note = false');
    }

    const threadAnswers = await query.getRawMany<ThreadAnswer & User>();

    return threadAnswers;
  }

  async save(args: ThreadAnswer): Promise<ThreadAnswer> {
    const threadAnswer = await this.ormRepository.save(args);

    return threadAnswer;
  }

  async remove(args: ThreadAnswer): Promise<void> {
    await this.ormRepository.remove(args);
  }
}
