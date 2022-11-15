import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CourseLessonInput {
  @Field(() => ID)
  courseId: string;

  @Field(() => ID)
  moduleId: string;

  @Field(() => ID)
  courseVersionId: string;

  @Field()
  title: string;

  @Field(() => Int)
  sortOrder: number;
}
