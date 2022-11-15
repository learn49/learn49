import {
  Resolver,
  ResolveField,
  Args,
  Mutation,
  Query,
  Context,
  Parent,
  Int,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/authGuard';
import { Lesson } from './dto/course-lesson.public';
import { CourseLessonInput } from './dto/courseLesson.input';
import { EditLessonInput } from './dto/editLesson.input';
import { NewLessonSortOrderInput } from './dto/newLessonSortOrder.input';
import { User } from '@/modules/users/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '@/sentry.interceptor';

import { Course } from '@/modules/courses/dto/course';

import { CourseLessonService } from './course-lessons.service';
import { CourseService } from '@/modules/courses/courses.service';
import { Entity } from '../extensions/dto/WriteCustomFieldInput';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Lesson)
export class CourseLessonResolver {
  constructor(
    private readonly courseLessonService: CourseLessonService,
    private readonly courseService: CourseService,
    private readonly customFieldExtension: CustomFieldExtension,
  ) { }

  @UseGuards(AuthGuard)
  @Mutation(() => Lesson)
  async createCourseLesson(
    @Args('input') input: CourseLessonInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.courseLessonService.create({
      accountId,
      userId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => [Lesson])
  async getCourseLessons(
    @Args('accountId') accountId: string,
    @Args('moduleId') moduleId: string,
    @Args({ name: 'baseId', type: () => String, nullable: true })
    baseId: string,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'offset', nullable: true, type: () => Int }) offset: number,
  ) {
    const { lessons } = await this.courseLessonService.findAll({
      accountId,
      moduleId,
      baseId,
      limit,
      offset,
    });

    return lessons;
  }

  @UseGuards(AuthGuard)
  @Query(() => Lesson)
  async getCourseLesson(
    @Args('accountId') accountId: string,
    @Args('lessonId') lessonId: string,
  ) {
    const lesson = await this.courseLessonService.findOne({
      accountId,
      lessonId,
    });
    return lesson;
  }

  @UseGuards(AuthGuard)
  @Query(() => Lesson)
  async getCourseLessonByEnrollment(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
    @Args('courseVersionId') courseVersionId: string,
    @Args('lessonId') lessonId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    const lesson = await this.courseLessonService.findOneByEnrollment({
      accountId,
      userId,
      courseId,
      courseVersionId,
      lessonId,
    });
    return lesson;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Lesson)
  async createOrUpdateLastCourseLessonAccess(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
    @Args('courseVersionId') courseVersionId: string,
    @Args('lessonId') lessonId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    const lesson = await this.courseLessonService.createOrUpdateLastCourseLessonAccess(
      {
        accountId,
        userId,
        courseId,
        courseVersionId,
        lessonId,
      },
    );
    return lesson;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Lesson)
  async markLessonAsSeen(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
    @Args('lessonId') lessonId: string,
    @Args('isCompleted') isCompleted: boolean,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    const lesson = await this.courseLessonService.markAsSeen({
      accountId,
      userId,
      courseId,
      lessonId,
      isCompleted,
    });
    return lesson;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Lesson)
  async editCourseLesson(
    @Args('accountId') accountId: string,
    @Args('lessonId') lessonId: string,
    @Args('input') input: EditLessonInput,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;

    return this.courseLessonService.update({
      accountId,
      lessonId,
      userId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async changeCourseLessonSortOrder(
    @Args('accountId') accountId: string,
    @Args('courseId') courseId: string,
    @Args('moduleId') moduleId: string,
    @Args('courseVersionId') courseVersionId: string,
    @Args({ name: 'baseId', type: () => String, nullable: true })
    baseId: string,
    @Args({ name: 'lessons', type: () => [NewLessonSortOrderInput] })
    lessons: NewLessonSortOrderInput[],
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.courseLessonService.changeSortOrder({
      accountId,
      userId,
      courseId,
      courseVersionId,
      moduleId,
      lessons,
      baseId,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async deleteCourseLesson(
    @Args('accountId') accountId: string,
    @Args('lessonId') lessonId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return await this.courseLessonService.deleteById({
      accountId,
      lessonId,
      userId,
    });
  }

  @ResolveField(() => Boolean, { name: 'completed', nullable: true })
  async completed(@Parent() lesson: Lesson, @Context('user') user: User) {
    const { id, baseLessonId, accountId } = lesson;
    const userId = user?.id;
    return this.courseLessonService.completed({
      accountId,
      lessonId: baseLessonId ?? id,
      userId,
    });
  }

  @ResolveField(() => Course)
  async course(@Parent() lesson: Lesson) {
    const { id, accountId } = lesson;

    const { courseId } = await this.courseLessonService.findOne({
      lessonId: id,
      accountId,
    });

    const course = await this.courseService.findOne({
      courseId,
      accountId,
    });

    return course;
  }

  @ResolveField(() => String, { nullable: true })
  async extensions(
    @Parent() lesson: Lesson,
    @Args('installationId') installationId: string,
    @Args('slug') extensionSlug: string,
    @Args('field') field: string,
  ) {
    return this.customFieldExtension.read({
      accountId: lesson.accountId,
      entity: Entity.course_lessons,
      entityId: lesson.id,
      installationId,
      extensionSlug,
      field,
    });
  }
}
