import {
  Resolver,
  Args,
  Query,
  Mutation,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { Thread, AllThreads } from './dto/thread';
import { ThreadInput } from './dto/thread.input';
import { ThreadService } from './thread.service';
import { UpdateThreadInput } from './dto/updateThread.input';
import { User } from '../users/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';
import { Lesson } from '../course-lessons/dto/course-lesson.public';
import { Course } from '../courses/dto/course';
import { CourseLessonService } from '../course-lessons/course-lessons.service';
import { CourseService } from '../courses/courses.service';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Thread)
export class ThreadResolver {
  constructor(
    private readonly threadService: ThreadService,
    private readonly courseLessonService: CourseLessonService,
    private readonly courseService: CourseService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => Thread, { name: 'getDiscussion' })
  async getDiscussion(
    @Args('accountId') accountId: string,
    @Args({ type: () => String, name: 'courseId', nullable: true })
    courseId: string,
    @Args('threadId') threadId: string,
    @Context('user') user: User,
  ) {
    const { id: userId, role } = user;
    return this.threadService.findOne({
      accountId,
      courseId,
      threadId,
      role,
      userId,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => AllThreads, { name: 'getDiscussions' })
  async getDiscussions(
    @Args('limit') limit: number,
    @Args('offset') offset: number,
    @Args('accountId') accountId: string,
    @Args({ type: () => String, name: 'courseId', nullable: true })
    courseId: string,
    @Args({ type: () => String, name: 'lessonId', nullable: true })
    lessonId: string,
    @Args({ type: () => Boolean, name: 'isTicket', nullable: true })
    isTicket: boolean,
    @Args({ type: () => Boolean, name: 'myTickets', nullable: true })
    myTickets: boolean,
    @Args({ type: () => String, name: 'title', nullable: true }) title: string,
    @Args({ type: () => String, name: 'filter', nullable: true })
    filter: string,
    @Context('user') user: User,
  ) {
    const { id: userId, role } = user;
    return this.threadService.findAll({
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
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Thread, { name: 'createThread' })
  async createThread(
    @Args('accountId') accountId: string,
    @Args('input') input: ThreadInput,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.threadService.create({ accountId, userId, ...input });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Thread, { name: 'updateThread' })
  async updateThread(
    @Args('accountId') accountId: string,
    @Args('threadId') threadId: string,
    @Args('input') input: UpdateThreadInput,
    @Context('user') user: User,
  ) {
    const { id: userId, role } = user;
    const thread = await this.threadService.update({
      accountId,
      threadId,
      userId,
      role,
      ...input,
    });

    return thread;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String, { name: 'deleteThread' })
  async deleteThread(
    @Args('accountId') accountId: string,
    @Args('threadId') threadId: string,
    @Context('user') user: User,
  ) {
    const { id: userId, role } = user;
    return this.threadService.delete({
      accountId,
      threadId,
      userId,
      role,
    });
  }

  @ResolveField(() => Lesson, { name: 'lesson', nullable: true })
  async lesson(@Parent() thread: Thread) {
    const { accountId, lessonId } = thread;

    if (lessonId) {
      return this.courseLessonService.findOne({
        accountId,
        lessonId,
      });
    }

    return null;
  }

  @ResolveField(() => Course, { name: 'course', nullable: true })
  async course(@Parent() thread: Thread) {
    const { accountId, courseId } = thread;

    const course = await this.courseService.findOne({
      accountId,
      courseId,
    });

    return course || null;
  }
}
