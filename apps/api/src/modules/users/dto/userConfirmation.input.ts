import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UserConfirmationInput {
  @Field(() => ID) tokenId: string;
  @Field() plainToken: string;
}
