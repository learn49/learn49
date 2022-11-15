import { Injectable, Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { uploadFile } from '../../utils/upload-file';
import { AppExceptions } from '@/utils/AppExceptions';
import { IThreadAnswersRepository } from './repositories/thread-answers-repository.interface';
import { IThreadRepository } from '../thread/repositories/thread-repository.interface';
import { INotificationInterface } from '../notifications/notification.interface';
import {
  CreateThreadAnswerArgs,
  DeleteThreadAnswer,
  UpdateThreadAnswer,
} from './types';

@Injectable()
export class ThreadAnswerService {
  constructor(
    @Inject('THREAD_ANSWER_REPOSITORY')
    private readonly threadAnswerRepository: IThreadAnswersRepository,
    @Inject('THREAD_REPOSITORY')
    private readonly threadRepository: IThreadRepository,
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationsRepository: INotificationInterface,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) { }
  async create({
    accountId,
    userId,
    firstName,
    lastName,
    profilePicture,
    threadId,
    body,
    isInternalNote = false,
  }: CreateThreadAnswerArgs) {
    try {
      const answer = await this.threadAnswerRepository.create({
        accountId,
        userId,
        threadId,
        body: JSON.parse(body),
        isAnswer: false,
        isInternalNote,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const thread = await this.threadRepository.findOne({
        id: threadId,
      });

      const parsedBody = JSON.parse(body);

      const mentions: any = Object.values(parsedBody.entityMap).filter(
        (entity: any) => entity.type === 'mention',
      );

      if (mentions.length) {
        for (const mention of mentions) {
          const notification = await this.notificationsRepository.create({
            accountId,
            userId: mention.data.mention.id,
            notifiedBy: userId,
            type: 'mention',
            message: `'${thread.title}'`,
            read: false,
            data: {
              courseId: thread.courseId,
              threadId: thread.id,
              threadAnswerId: answer.id,
            },
          });

          this.pubSub.publish('notificationAdded', {
            notificationAdded: {
              ...notification,
              data: JSON.stringify(notification.data),
              user: {
                id: userId,
                firstName,
                lastName,
                profilePicture,
              },
            },
          });
        }
      }

      if (thread.userId !== userId && !isInternalNote) {
        const notification = await this.notificationsRepository.create({
          accountId,
          userId: thread.userId,
          notifiedBy: userId,
          type: 'thread_answer',
          message: `'${thread.title}'`,
          read: false,
          data: {
            courseId: thread.courseId,
            threadId: thread.id,
            threadAnswerId: answer.id,
          },
        });

        this.pubSub.publish('notificationAdded', {
          notificationAdded: {
            ...notification,
            data: JSON.stringify(notification.data),
            user: {
              id: userId,
              firstName,
              lastName,
              profilePicture,
            },
          },
        });
      }

      return answer;
    } catch (error) {
      // @TODO vai haver esse rollback?
      //await trx.rollback();
    }
  }

  async update({
    accountId,
    userId,
    role,
    threadId,
    threadAnswerId,
    body,
    isAnswer,
  }: UpdateThreadAnswer) {
    const threadAnswer = await this.threadAnswerRepository.findOne({
      id: threadAnswerId,
      accountId,
    });

    if (!threadAnswer) {
      throw AppExceptions.ThreadNotFound;
    }

    // TODO: checar tutor
    if (role === 'user' && userId !== threadAnswer.userId) {
      throw AppExceptions.AccessDenied;
    }

    if (body) threadAnswer.body = body;
    if (typeof isAnswer === 'boolean') threadAnswer.isAnswer = isAnswer;

    await this.threadAnswerRepository.save(threadAnswer);

    const thread = await this.threadRepository.findOne({
      id: threadId,
      accountId,
    });

    if (isAnswer) {
      thread.isSolved = isAnswer ? true : false;
      thread.isClosed = isAnswer ? true : false;
    }

    await this.threadRepository.save(thread);

    return {
      ...threadAnswer,
      body: JSON.stringify(threadAnswer.body),
    };
  }

  async delete({
    accountId,
    threadAnswerId,
    userId,
    role,
  }: DeleteThreadAnswer) {
    const threadAnswer = await this.threadAnswerRepository.findOne({
      id: threadAnswerId,
      accountId,
    });

    if (!threadAnswer) {
      throw AppExceptions.ThreadNotFound;
    }

    // TODO: checar tutor
    if (role === 'user' && userId !== threadAnswer.userId) {
      throw AppExceptions.AccessDenied;
    }

    await this.threadAnswerRepository.remove(threadAnswer);

    return threadAnswerId;
  }

  async uploadFile({ file }) {
    const { createReadStream, filename, mimetype } = await file;

    const { url } = await uploadFile({ createReadStream, filename, mimetype });

    return url;
  }
}
