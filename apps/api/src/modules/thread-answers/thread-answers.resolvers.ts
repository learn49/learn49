import { Resolver, Args, Mutation, Context } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { ThreadAnswers } from './dto/thread-answers';
import { ThreadAnswersInput } from './dto/thread-answers.input';
import { UpdateThreadAnswersInput } from './dto/update-thread-answers.input';
import { ThreadAnswerService } from './thread-answers.service';
import { User } from '@/modules/users/dto/user';
import { Upload } from '@/scalars/upload.scalar';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(ThreadAnswers)
export class ThreadAnswerResolver {
  constructor(private readonly threadAnswerService: ThreadAnswerService) {}

  // @UseGuards(AuthGuard)
  // @Query(returns => [Enrollment], { name: 'getEnrollments' })
  // async getEnrollments(
  //   @Args('accountId') accountId: string,
  //   @Args('courseId') courseId: string,
  //   @Context('user') user: User
  // ) {
  //   const { id: userId } = user;
  //   const { enrollments } = await this.enrollmentService.findAll({ userId, accountId, courseId });

  // return listToCamel(enrollments);
  // }

  @UseGuards(AuthGuard)
  @Mutation(() => ThreadAnswers, { name: 'createThreadAnswer' })
  async createThreadAnswer(
    @Args('accountId') accountId: string,
    @Args('input') input: ThreadAnswersInput,
    @Context('user') user: User,
  ) {
    const { id: userId, firstName, lastName, profilePicture } = user;

    return this.threadAnswerService.create({
      accountId,
      userId,
      firstName,
      lastName,
      profilePicture,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ThreadAnswers, { name: 'updateThreadAnswer' })
  async updateThreadAnswer(
    @Args('accountId') accountId: string,
    @Args('input') input: UpdateThreadAnswersInput,
    @Context('user') user: User,
  ) {
    const { id: userId, role } = user;
    return this.threadAnswerService.update({
      accountId,
      userId,
      role,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String, { name: 'deleteThreadAnswer' })
  async deleteThreadAnswer(
    @Args('accountId') accountId: string,
    @Args('threadAnswerId') threadAnswerId: string,
    @Context('user') user: User,
  ) {
    const { id: userId, role } = user;
    return this.threadAnswerService.delete({
      accountId,
      threadAnswerId,
      userId,
      role,
    });
  }

  // FIXME: criar um modulo para este resolver
  @UseGuards(AuthGuard)
  @Mutation(() => String, { name: 'uploadFile' })
  async uploadFile(@Args('file') file: Upload) {
    return await this.threadAnswerService.uploadFile({ file });
  }
}
