import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { Lesson } from '../../course-lessons/dto/course-lesson.public';

@ObjectType()
export class CourseModule {
  @Field(() => ID) id: string;
  @Field(() => ID) accountId: string;
  @Field(() => ID) courseVersionId: string;
  @Field(() => ID, { nullable: true }) baseId: string;
  @Field() title: string;
  @Field() isActive: boolean;
  @Field(() => Int) sortOrder: number;
  lessons: [Lesson];
}
