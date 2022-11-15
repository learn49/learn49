import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Account {
  @Field(() => ID, { nullable: true }) id: string;
  @Field({ nullable: true }) subdomain: string;
  @Field({ nullable: true }) friendlyName: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) recaptchaSiteKey: string;
}
