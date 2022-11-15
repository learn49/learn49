import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Extension {
  @Field(() => ID) id: string;
  @Field(() => ID) account_id: string;
  @Field() name: string;
  @Field(() => ID) user_id: string;
  @Field(() => ID, { nullable: true }) developer_id: string;
  @Field(() => Int) version: number;
  @Field({ nullable: true }) permissions: string;
  @Field({ nullable: true }) settings: string;
  @Field({ nullable: true }) scopes: string;
  @Field() created_at: Date;
  @Field() updated_at: Date;
}
