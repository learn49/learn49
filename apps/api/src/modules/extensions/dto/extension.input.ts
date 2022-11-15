import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class ExtensionInput {
  @Field(() => ID, { nullable: true }) developerId: string;
  @Field() name: string;
  @Field(() => Int) version: number;
  @Field({ nullable: true }) permissions: string;
  @Field({ nullable: true }) settings: string;
  @Field({ nullable: true }) scopes: string;
}
