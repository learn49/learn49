import { Resolver, Args, Mutation, Query, Context, Int } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { CourseVersion } from './dto/courseVersion';
import { CourseVersionInput } from './dto/courseVersion.input';
import { CourseVersionService } from './course-versions.service';
import { User } from '../users/dto/user';

import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(() => CourseVersion)
export class CourseVersionResolver {
  constructor(private readonly courseVersionService: CourseVersionService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CourseVersion, { name: 'createCourseVersion' })
  async createCourseVersion(
    @Args('input') input: CourseVersionInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.courseVersionService.create({
      accountId,
      userId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => [CourseVersion], { name: 'getCourseVersions' })
  async getCourseVersions(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit: number,
    @Args({ name: 'offset', type: () => Int, nullable: true }) offset: number,
  ) {
    const { versions } = await this.courseVersionService.findAll({
      accountId,
      courseId,
      limit,
      offset,
    });

    return versions;
  }
}
