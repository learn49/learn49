import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEmail {
  @Field()
  main: boolean;

  @Field()
  email: string;

  @Field()
  verified: boolean;
}
