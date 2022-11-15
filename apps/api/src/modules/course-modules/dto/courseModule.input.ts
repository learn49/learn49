import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CourseModuleInput {
  @Field(() => ID)
  courseVersionId: string;

  @Field()
  title: string;

  @Field(() => Int)
  sortOrder: number;
}
