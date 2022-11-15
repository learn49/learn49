import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user';

@ObjectType()
export class Auth {
  @Field() user: User;
  @Field() token: string;
}
