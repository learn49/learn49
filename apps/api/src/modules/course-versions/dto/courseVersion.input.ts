import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CourseVersionInput {
  @Field(() => ID)
  courseId: string;

  @Field(() => ID)
  courseVersionId: string;

  @Field()
  versionName: string;

  @Field()
  description: string;

  @Field()
  allowBuy: boolean;
}
