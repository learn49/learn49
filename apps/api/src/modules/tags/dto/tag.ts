import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Tag {
  @Field(() => ID) id: string;
  @Field() accountId: string;
  @Field() courseId: string;
  @Field() name: string;
}
