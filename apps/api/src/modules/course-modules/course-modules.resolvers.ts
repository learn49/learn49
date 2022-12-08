import {
  Resolver,
  ResolveField,
  Parent,
  Args,
  Mutation,
  Query,
  Context,
  Int,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/authGuard';
import { CourseModule } from './dto/courseModule';
import { Lesson } from '@/modules/course-lessons/dto/course-lesson.public';
import { CourseModuleInput } from './dto/courseModule.input';
import { EditCourseModuleInput } from './dto/editCourseModule.input';
import { NewModuleSortOrderInput } from './dto/newModuleSortOrder.input';
import { CourseModuleService } from './course-modules.service';
import { User } from '@/modules/users/dto/user';

import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '@/sentry.interceptor';
import { Entity } from '../extensions/dto/WriteCustomFieldInput';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';

@UseInterceptors(SentryInterceptor)
@Resolver(() => CourseModule)
export class CourseModuleResolver {
  constructor(
    private readonly courseModuleService: CourseModuleService,
    private readonly customFieldExtension: CustomFieldExtension,
  ) { }

  @UseGuards(AuthGuard)
  @Mutation(() => CourseModule, { name: 'createCourseModule' })
  async createCourseModule(
    @Args('input') input: CourseModuleInput,
    @Context('user') user: User,
  ) {
    const { id: userId, accountId } = user;
    return await this.courseModuleService.create({
      accountId,
      userId,
      ...input,
    });
  }

  @Query(() => [CourseModule], { name: 'getCourseModules' })
  async getCourseModules(
    @Args('accountId') accountId: string,
    @Args('courseVersionId') courseVersionId: string,
    @Args({ name: 'limit', nullable: true, type: () => Int }) limit: number,
    @Args({ name: 'offset', nullable: true, type: () => Int }) offset: number,
    @Context('user') user?: User,
  ) {
    const userId = user?.id;
    const { modules } = await this.courseModuleService.findAll({
      accountId,
      courseVersionId,
      limit,
      offset,
      userId,
    });
    return modules;
  }

  @UseGuards(AuthGuard)
  @Query(() => CourseModule, { name: 'getCourseModule' })
  async getCourseModule(
    @Args('accountId') accountId: string,
    @Args('courseVersionId') courseVersionId: string,
    @Args('courseModuleId') courseModuleId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    const { courseModule } = await this.courseModuleService.findOne({
      accountId,
      courseVersionId,
      courseModuleId,
      userId,
    });

    return courseModule;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CourseModule, { name: 'editCourseModule' })
  async editCourseModule(
    @Args('accountId') accountId: string,
    @Args('moduleId') moduleId: string,
    @Args('input') input: EditCourseModuleInput,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;

    const module = await this.courseModuleService.update({
      accountId,
      moduleId,
      userId,
      ...input,
    });

    return module;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String, { name: 'deleteCourseModule' })
  async deleteCourseModule(
    @Args('accountId') accountId: string,
    @Args('moduleId') moduleId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return await this.courseModuleService.deleteById({
      accountId,
      moduleId,
      userId,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async changeCourseModuleSortOrder(
    @Args('accountId') accountId: string,
    @Args('courseVersionId') courseVersionId: string,
    @Args({ name: 'modules', type: () => [NewModuleSortOrderInput] })
    modules: [NewModuleSortOrderInput],
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return await this.courseModuleService.changeSortOrder({
      accountId,
      userId,
      courseVersionId,
      modules,
    });
  }

  @ResolveField(() => [Lesson], { name: 'lessons' })
  async lessons(@Parent() module: CourseModule, @Context('user') user: User) {
    const { id, baseId, courseVersionId } = module;
    const userId = user?.id;
    const lessons = await this.courseModuleService.findLessonsByModuleId({
      moduleId: baseId ?? id,
      userId,
      courseVersionId,
    });
    return lessons;
  }

  @ResolveField(() => String, { nullable: true })
  async extensions(
    @Parent() courseModule: CourseModule,
    @Args('installationId') installationId: string,
    @Args('slug') extensionSlug: string,
    @Args('field') field: string,
  ) {
    return this.customFieldExtension.read({
      accountId: courseModule.accountId,
      entity: Entity.course_modules,
      entityId: courseModule.id,
      installationId,
      extensionSlug,
      field,
    });
  }
}
