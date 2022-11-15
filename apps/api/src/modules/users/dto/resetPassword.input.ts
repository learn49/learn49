import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field(() => ID) tokenId: string;
  @Field() plainToken: string;
  @Field() passwd: string;
  @Field() confirmPasswd: string;
}
