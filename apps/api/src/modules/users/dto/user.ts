import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserEnrollments } from './enrollments';
import { UserEmail } from './userEmail';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  accountId: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  profilePicture: string;

  //TODO: Bypass: Waiting for real feature
  @Field()
  email: string;

  @Field()
  role: string;

  @Field(() => [UserEnrollments], { nullable: true })
  enrollments: UserEnrollments[];

  @Field(() => [UserEmail])
  emails: UserEmail[];
}
