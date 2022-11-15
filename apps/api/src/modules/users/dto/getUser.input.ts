import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class GetUserInput {
  @Field(() => ID) userId: string;
}
