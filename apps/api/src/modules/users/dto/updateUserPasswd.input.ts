import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserPasswdInput {
  @Field() currentPasswd: string;
  @Field() newPasswd: string;
  @Field() confirm: string;
}
