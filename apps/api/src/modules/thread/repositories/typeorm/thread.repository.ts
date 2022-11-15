import { User } from '@/modules/users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from '../../thread.entity';
import {
  CountThreadArgs,
  CreateThreadArgs,
  FindAllThreadArgs,
  FineOneThreadArgs,
  IThreadRepository,
} from '../thread-repository.interface';

@Injectable()
export class CustomThreadRepository implements IThreadRepository {
  constructor(
    @InjectRepository(Thread)
    private readonly ormRepository: Repository<Thread>,
  ) {}

  async create(args: CreateThreadArgs): Promise<Thread> {
    const createdThread = this.ormRepository.create(args);

    const thread = await this.ormRepository.save(createdThread);

    return thread;
  }

  async findOne({
    id,
    accountId,
    courseId,
  }: FineOneThreadArgs): Promise<Thread | undefined> {
    let query = this.ormRepository
      .createQueryBuilder('threads')
      .select('threads.id', 'id')
      .addSelect('threads.account_id', 'accountId')
      .addSelect('threads.course_id', 'courseId')
      .addSelect('threads.title', 'title')
      .addSelect('threads.body', 'body')
      .addSelect('threads.tags', 'tags')
      .addSelect('threads.is_closed', 'isClosed')
      .addSelect('threads.is_solved', 'isSolved')
      .addSelect('threads.is_ticket', 'isTicket')
      .addSelect('threads.created_at', 'createdAt')
      .addSelect('users.id', 'userId')
      .addSelect('users.first_name', 'firstName')
      .addSelect('users.last_name', 'lastName')
      .addSelect('users.profile_picture', 'profilePicture')
      .innerJoin('users', 'users', 'users.id = threads.user_id');

    if (id) {
      query = query.andWhere('threads.id = :id', { id });
    }

    if (accountId) {
      query = query.andWhere('threads.account_id = :accountId', { accountId });
    }

    if (courseId) {
      query = query.andWhere('threads.course_id = :courseId', { courseId });
    }

    const thread = await query.getRawOne();

    return thread;
  }

  async findAll({
    accountId,
    isTicket,
    myTickets,
    filter,
    title,
    courseIds,
    role,
    courseId,
    lessonId,
    userId,
    limit,
    offset,
    order,
  }: FindAllThreadArgs): Promise<(User & Thread)[]> {
    let query = this.ormRepository
      .createQueryBuilder('threads')
      .select('threads.id', 'id')
      .addSelect('threads.account_id', 'accountId')
      .addSelect('threads.course_id', 'courseId')
      .addSelect('threads.title', 'title')
      .addSelect('threads.body', 'body')
      .addSelect('threads.tags', 'tags')
      .addSelect('threads.lesson_id', 'lessonId')
      .addSelect('threads.is_solved', 'isSolved')
      .addSelect('threads.is_closed', 'isClosed')
      .addSelect('threads.created_at', 'createdAt')
      .addSelect('users.id', 'userId')
      .addSelect('users.first_name', 'firstName')
      .addSelect('users.last_name', 'lastName')
      .addSelect('users.profile_picture', 'profilePicture')
      .innerJoin('users', 'users', 'users.id = threads.user_id');

    if (accountId) {
      query = query.andWhere('threads.account_id = :accountId', { accountId });
    }

    if (!isTicket && myTickets) {
      query = query.andWhere('threads.is_ticket = true');
    } else {
      query = query.andWhere('threads.is_ticket = false');
    }

    if (filter && filter === 'open') {
      query = query.andWhere('threads.is_closed = false');
    }

    if (filter && filter === 'close') {
      query = query.andWhere('threads.is_closed = true');
    }

    if (title) {
      query = query.andWhere('title ILike :title', {
        title: `%${title}%`,
      });
    }

    if (role === 'user') {
      if (courseIds && courseIds.length > 0) {
        query = query.andWhere('course_id IN (:...courseIds)', {
          courseIds,
        });
      }

      if (userId) {
        query = query.andWhere('threads.user_id = :userId', { userId });
      }
    }

    if (role === 'owner' || role === 'admin') {
      if (isTicket) {
        query = query.andWhere('threads.is_ticket = :isTicket', {
          isTicket,
        });
      }
      if (courseId) {
        query = query.andWhere('threads.course_id = :courseId', {
          courseId,
        });
      }
      if (lessonId) {
        query = query.andWhere('threads.lesson_id = :lessonId', {
          lessonId,
        });
      }
      if (myTickets) {
        query = query.andWhere('threads.is_ticket = true');
      }
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.offset(offset);
    }

    if (order && order.createdAt) {
      query = query.orderBy('threads.created_at', order.createdAt);
    }

    console.log(query.getSql());

    const threads = await query.getRawMany<User & Thread>();

    return threads;
  }

  async save(args: Thread): Promise<Thread> {
    const thread = await this.ormRepository.save(args);

    return thread;
  }

  async count({
    accountId,
    filter,
    courseIds,
    courseId,
    lessonId,
    isTicket,
    isClosed,
  }: CountThreadArgs): Promise<number> {
    let query = this.ormRepository.createQueryBuilder('threads');

    if (accountId) {
      query = query.andWhere('threads.account_id = :accountId', { accountId });
    }

    if (filter && filter === 'open') {
      query = query.andWhere('threads.is_closed = false');
    }

    if (filter && filter === 'close') {
      query = query.andWhere('threads.is_closed = true');
    }

    if (courseId) {
      query = query.andWhere('course_id = :courseId', { courseId });
    }

    if (lessonId) {
      query = query.andWhere('lesson_id = :lessonId', { lessonId });
    }

    if (courseIds && courseIds.length > 0) {
      query = query.andWhere('course_id IN (:...courseIds)', {
        courseIds,
      });
    }

    if (typeof isClosed === 'boolean') {
      query = query.andWhere('is_closed = :isClosed', { isClosed });
    }

    if (typeof isTicket === 'boolean') {
      query = query.andWhere('is_ticket = :isTicket', { isTicket });
    }

    const totalCount = query.getCount();

    return totalCount;
  }

  async remove(args: Thread): Promise<void> {
    await this.ormRepository.remove(args);
  }
}
