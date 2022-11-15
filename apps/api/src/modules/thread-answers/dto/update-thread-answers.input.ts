import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateThreadAnswersInput {
  @Field(() => ID)
  threadAnswerId: string;

  @Field(() => ID)
  threadId: string;

  @Field({ nullable: true })
  isAnswer: boolean;

  @Field({ nullable: true })
  body: string;
}
