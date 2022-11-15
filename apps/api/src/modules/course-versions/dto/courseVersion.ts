import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class CourseVersion {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  allowBuy: string;
}
