import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateLabelInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: false })
  label: string;

  @Field(() => ID, { nullable: false })
  accountId: string;

  @Field({ nullable: true })
  isPrivate: boolean;
}
