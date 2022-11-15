import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { LastCourseAccess } from './dto/last-course-access';
import { LastCourseAccessService } from './last-course-access.service';
import { User } from '../users/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(LastCourseAccess)
export class LastCourseAccessResolvers {
  constructor(private readonly lastCourseAccess: LastCourseAccessService) {}

  @UseGuards(AuthGuard)
  @Query(() => LastCourseAccess, {
    name: 'getLastCourseAccess',
    nullable: true,
  })
  async getLastCourseAccess(
    @Args('accountId') accountId: string,
    @Args({ name: 'courseId', type: () => String, nullable: true })
    courseId: string,
    @Context('user') user: User,
  ) {
    const userId = user.id;
    return this.lastCourseAccess.findOne({ accountId, userId, courseId });
  }
}
