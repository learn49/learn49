import {
  ID,
  Field,
  ObjectType,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql';

import { Course } from '@/modules/courses/dto/course';

@ObjectType()
export class Lesson {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  accountId: string;

  @Field()
  title: string;

  @Field(() => Int)
  sortOrder: number;

  @Field(() => ID, { nullable: true })
  baseLessonId: string;

  @Field(() => ID)
  moduleId: string;

  @Field({ nullable: true })
  blocks: string;

  completed: boolean;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  duration: string;

  @Field({ nullable: true })
  nextLesson: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  releaseOnDate: Date;

  @Field(() => Int, { nullable: true })
  releaseAfter: number;

  @Field()
  courseName: string;

  course: Course;
}
