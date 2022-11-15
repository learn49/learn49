import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '@/modules/users/dto/user';

@ObjectType()
export class ThreadAnswers {
  @Field(() => ID)
  id: string;

  @Field()
  author: string;

  @Field(() => User)
  user: User;

  @Field(() => ID)
  threadId: string;

  @Field()
  isAnswer: boolean;

  @Field()
  isInternalNote: boolean;

  @Field()
  body: string;

  @Field()
  createdAt: Date;
}
