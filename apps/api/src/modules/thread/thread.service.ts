import { AppExceptions } from '@/utils/AppExceptions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendgridService } from '../../services/sendgrid.service';
import { ICourseRepository } from '../courses/repositories/course-repository.interface';
import { Enrollment } from '../enrollment/enrollment.entity';
import { IThreadAnswersRepository } from '../thread-answers/repositories/thread-answers-repository.interface';
import { User } from '../users/user.entity';
import { IThreadRepository } from './repositories/thread-repository.interface';
import {
  CreateThreadArgs,
  DeleteThreadArgs,
  FindAllThreadArgs,
  FindOneThreadArgs,
  UpdateThreadArgs,
} from './types';

@Injectable()
export class ThreadService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @Inject('THREAD_ANSWER_REPOSITORY')
    private readonly threadAnswerRepository: IThreadAnswersRepository,
    @Inject('THREAD_REPOSITORY')
    private readonly threadRepository: IThreadRepository,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepository: ICourseRepository,
    private readonly sendGrid: SendgridService,
  ) { }
  async create({
    accountId,
    userId,
    courseId,
    lessonId,
    moduleId,
    title,
    body,
    tags,
    isTicket = false,
  }: CreateThreadArgs) {
    const thread = await this.threadRepository.create({
      accountId,
      userId,
      courseId,
      moduleId,
      lessonId,
      title,
      body: JSON.parse(body),
      tags: JSON.parse(tags),
      isSolved: false,
      isTicket,
      isPinned: false,
      isClosed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (isTicket) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
          accountId,
        },
      });

      if (!user) {
        throw AppExceptions.StudentNotFound;
      }

      await this.sendGrid.newTicket({
        name: `${user.firstName} ${user.lastName}`,
        title,
        threadId: thread.id,
      });
    }

    return {
      id: thread.id,
      userId: thread.userId,
      courseId: thread.courseId,
      moduleId: thread.moduleId,
      lessonId: thread.lessonId,
      title,
      body: JSON.stringify(thread.body),
      isSolved: thread.isSolved,
      isTicket: thread.isTicket,
      isPinned: thread.isPinned,
      isClosed: thread.isClosed,
    };
  }

  async findOne({
    accountId,
    courseId,
    threadId,
    role,
    userId,
  }: FindOneThreadArgs) {
    const getDiscussion = await this.threadRepository.findOne({
      id: threadId,
      accountId,
      courseId,
    });

    const discussion = getDiscussion as any;

    if (!discussion) {
      throw AppExceptions.ThreadNotFound;
    }

    const enrollment = await this.enrollmentRepository.findOne({
      userId,
      accountId,
      courseId: discussion.courseId,
    });

    const course = await this.courseRepository.findOne({
      id: discussion.courseId,
      accountId,
    });

    const answers = await this.threadAnswerRepository.findAllByThreadIdAndAccountIdAndRole(
      { threadId, accountId, role },
    );

    const parsedAnswers = answers.map(answer => ({
      ...answer,
      isAnswer: answer.isAnswer,
      isInternalNote: answer.isInternalNote,
      threadId: answer.threadId,
      body: JSON.stringify(answer.body),
      author: `${answer.firstName} ${answer.lastName}`,
      user: {
        id: answer.userId,
        firstName: answer.firstName,
        lastName: answer.lastName,
        profilePicture: answer.profilePicture,
      },
      createdAt: answer.createdAt,
    }));

    const result = {
      ...discussion,
      accountId: discussion.accountId,
      courseId: discussion.courseId || null,
      lessonId: discussion.lessonId || null,
      body: JSON.stringify(discussion.body),
      tags: JSON.stringify(discussion.tags),
      author: `${discussion.firstName} ${discussion.lastName}`,
      user: {
        id: discussion.userId,
        firstName: discussion.firstName,
        lastName: discussion.lastName,
        profilePicture: discussion.profilePicture,
      },
      answers: parsedAnswers,
      courseVersionId:
        enrollment?.courseVersionId || course?.defaultVersion || null,
    };

    return result;
  }

  // FIXME: Refatorar/melhorar findAll
  async findAll({
    limit,
    offset,
    accountId,
    courseId,
    lessonId,
    isTicket,
    filter,
    myTickets,
    userId,
    role,
    title,
  }: FindAllThreadArgs) {
    const courseIdList = [];
    if (role === 'user') {
      if (!courseId && !lessonId && !myTickets && !isTicket) {
        const enrollments = await this.enrollmentRepository.find({
          where: {
            userId,
          },
        });

        const enrollmentsByLabel = await this.enrollmentRepository
          .createQueryBuilder('enrollment')
          .select('label_course.course_id', 'courseId')
          .innerJoin(
            'label_enrollment',
            'label_enrollment',
            'enrollment.id = label_enrollment.enrollment_id',
          )
          .innerJoin(
            'label_course',
            'label_course',
            'label_enrollment.label_id = label_course.label_id',
          )
          .andWhere(`enrollment.user_id = '${userId}'`)
          .andWhere(`enrollment.account_id = '${accountId}'`)
          .getRawMany();

        if (enrollmentsByLabel.length > 0) {
          const courseIdsByLabel = enrollmentsByLabel.map(e => e.courseId);

          courseIdList.push(...courseIdsByLabel);
        }

        if (enrollments.length > 0) {
          enrollments.forEach(enrollment => {
            if (enrollment.courseId) {
              courseIdList.push(enrollment.courseId);
            }
          });
        }
      }
    }

    const discussions = await this.threadRepository.findAll({
      title,
      isTicket,
      userId,
      courseIds: courseIdList,
      role,
      courseId,
      lessonId,
      myTickets,
      filter,
      limit,
      offset,
      order: {
        createdAt: 'DESC',
      },
    });

    const discussionCount = await this.threadRepository.count({
      accountId,
      filter,
    });

    const totalCountClose = await this.threadRepository.count({
      isClosed: true,
      isTicket: false,
      accountId,
      courseId,
      lessonId,
      courseIds: courseIdList,
    });

    const totalCountOpen = await this.threadRepository.count({
      isClosed: false,
      isTicket: false,
      accountId,
      courseId,
      courseIds: courseIdList,
      lessonId,
    });

    const parsedDiscussion = discussions.map(discussion => ({
      id: discussion.id,
      accountId: discussion.accountId,
      courseId: discussion.courseId,
      title: discussion.title,
      body: discussion.body,
      tags: JSON.stringify(discussion.tags),
      lessonId: discussion.lessonId,
      createdAt: discussion.createdAt,
      isClosed: discussion.isClosed,
      user: {
        id: discussion.userId,
        firstName: discussion.firstName,
        lastName: discussion.lastName,
        profilePicture: discussion.profilePicture,
      },
    }));

    return {
      discussions: parsedDiscussion,
      totalDiscussion: discussionCount,
      totalOpen: totalCountOpen,
      totalClose: totalCountClose,
    };
  }

  async update({
    accountId,
    threadId,
    userId,
    role,
    title,
    body,
    tags,
    isClosed,
    isTicket,
    isSolved,
    isPinned,
  }: UpdateThreadArgs) {
    const thread = await this.threadRepository.findOne({
      id: threadId,
      accountId,
    });

    if (!thread) {
      throw AppExceptions.ThreadNotFound;
    }

    // TODO: checar tutor
    if (role === 'user' && userId !== thread.userId) {
      throw AppExceptions.AccessDenied;
    }

    if (title) thread.title = title;
    if (body) thread.body = JSON.parse(body);
    if (tags) thread.tags = JSON.parse(tags);
    if (typeof isClosed === 'boolean') thread.isClosed = isClosed;
    if (typeof isTicket === 'boolean') thread.isTicket = isTicket;
    if (typeof isSolved === 'boolean') thread.isSolved = isSolved;
    if (typeof isPinned === 'boolean') thread.isPinned = isPinned;

    thread.updatedAt = new Date();

    await this.threadRepository.save(thread);

    return thread;
  }

  async delete({ accountId, threadId, userId, role }: DeleteThreadArgs) {
    const thread = await this.threadRepository.findOne({
      id: threadId,
      accountId,
    });

    if (!thread) {
      throw AppExceptions.ThreadNotFound;
    }

    // TODO: checar tutor
    if (role === 'user' && userId !== thread.userId) {
      throw AppExceptions.AccessDenied;
    }

    await this.threadRepository.remove(thread);

    return threadId;
  }
}
