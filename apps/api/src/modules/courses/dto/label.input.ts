import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class LabelInput {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  label: string;

  @Field(() => ID, { nullable: true })
  accountId: string;

  @Field({ nullable: true })
  isPrivate: boolean;
}
