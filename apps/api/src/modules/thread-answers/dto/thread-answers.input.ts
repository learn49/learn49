import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ThreadAnswersInput {
  @Field(() => ID)
  threadId: string;

  @Field({ nullable: true })
  isInternalNote: boolean;

  @Field()
  body: string;
}
