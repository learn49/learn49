import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ExtensionsInput {
  @Field(() => ID, { nullable: true }) account_id: string;
}
