import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateLabelInput {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  label: string;

  @Field(() => ID, { nullable: true })
  accountId: string;
}
