import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class TagInput {
  @Field(() => ID) courseId: string;
  @Field() name: string;
}
