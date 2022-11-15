import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEnrollments {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  isPrivate: boolean;
}
