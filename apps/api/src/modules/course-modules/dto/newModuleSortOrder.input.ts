import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class NewModuleSortOrderInput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => ID, { nullable: true })
  baseId: string;
}
