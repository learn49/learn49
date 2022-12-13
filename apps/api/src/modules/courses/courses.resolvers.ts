import {
  Resolver,
  Args,
  Mutation,
  Query,
  Context,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { Course } from './dto/course';
import { CourseInput } from './dto/course.input';
import { UpdateCourseInput } from './dto/updateCourse.input';
import { CourseService } from './courses.service';
import { User } from '../users/dto/user';
import { SentryInterceptor } from '../../sentry.interceptor';

import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';
import { Entity } from '../extensions/dto/WriteCustomFieldInput';
import { Label } from '../labels/dto/label';
import { LabelService } from '../labels/label.service';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly labelService: LabelService,
    private readonly customFieldExtension: CustomFieldExtension,
  ) { }

  @UseGuards(AuthGuard)
  @Mutation(() => Course, { name: 'createCourse' })
  async createCourse(
    @Args('input') input: CourseInput,
    @Context('user') user: User,
  ) {
    const { id: userId, accountId } = user;
    const course = await this.courseService.create({
      accountId,
      userId,
      ...input,
    });

    return course;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course, { name: 'updateCourse' })
  async updateCourse(
    @Args('input') input: UpdateCourseInput,
    @Context('user') user: User,
  ) {
    const { id: userId, accountId } = user;
    return this.courseService.update({
      accountId,
      userId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Course, { name: 'deleteCourse' })
  async deleteCourse(
    @Args('courseId') courseId: string,
    @Context('user') user: User,
  ) {
    const { id: userId, accountId } = user;
    return this.courseService.destroy({
      accountId,
      courseId,
      userId,
    });
  }

  @Query(() => [Course], { name: 'getCourses' })
  async getCourses(
    @Args('accountId') accountId: string,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('offset', { defaultValue: 0 }) offset: number,
    @Context('user') user: User,
  ) {
    const userId = user?.id;
    const { courses } = await this.courseService.findAll({
      accountId,
      userId,
      limit,
      offset,
    });

    return courses;
  }

  @Query(() => Course, { name: 'getCourse', nullable: true })
  async getCourse(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
  ) {
    return await this.courseService.findOne({ accountId, courseId });
  }

  @ResolveField(() => [Label], { name: 'labels', nullable: true })
  async labels(@Parent() course: Course) {
    return this.labelService.findByCourse({
      accountId: course.accountId,
      courseId: course.id,
    });
  }

  @ResolveField(() => Number, { name: 'progress', nullable: true })
  async progress(@Parent() course: Course, @Context('user') user: User) {
    const { id: courseId } = course;
    if (!user) {
      return 0;
    }
    const { id: userId } = user;
    return this.courseService.progress({ userId, courseId });
  }

  @ResolveField(() => String, { nullable: true })
  async extensions(
    @Parent() course: Course,
    @Args('installationId', { nullable: true }) installationId: string,
    @Args('slug') extensionSlug: string,
    @Args('field') field: string,
  ) {
    return this.customFieldExtension.read({
      accountId: course.accountId,
      entity: Entity.courses,
      entityId: course.id,
      installationId,
      extensionSlug,
      field,
    });
  }
}
