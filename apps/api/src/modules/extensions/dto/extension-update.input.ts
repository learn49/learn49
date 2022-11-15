import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class ExtensionUpdateInput {
  @Field(() => ID, { nullable: true }) developer_id: string;
  @Field({ nullable: true }) name: string;
  @Field(() => Int, { nullable: true }) version: number;
  @Field({ nullable: true }) permissions: string;
  @Field({ nullable: true }) settings: string;
  @Field({ nullable: true }) scopes: string;
}
