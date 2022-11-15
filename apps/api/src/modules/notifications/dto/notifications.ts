import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from '@/modules/users/dto/user';

@ObjectType()
export class Notification {
  @Field(() => ID) id: string;
  @Field(() => ID) accountId: string;
  @Field() type: string;
  @Field() message: string;
  @Field() data: string;
  @Field(() => User) user: User;
  @Field() read: boolean;
  @Field() createdAt: Date;
}
