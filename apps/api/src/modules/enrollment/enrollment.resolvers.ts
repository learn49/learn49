import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { Enrollment } from './dto/enrollment';
import { EnrollmentInput } from './dto/enrollment.input';
import { EnrollmentService } from './enrollment.service';
import { User } from '../users/dto/user';

import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @UseGuards(AuthGuard)
  @Query(() => [Enrollment], { name: 'getEnrollments' })
  async getEnrollments(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.enrollmentService.findAll({
      userId,
      accountId,
      courseId,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Enrollment, { name: 'createEnrollment' })
  async createEnrollment(
    @Args('accountId') accountId: string,
    @Args('input') input: EnrollmentInput,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.enrollmentService.create({ userId, accountId, ...input });
  }
}
