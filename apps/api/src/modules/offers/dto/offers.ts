import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Offers {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() extensionId: string;
  @Field() type: string;
  @Field() price: string;
  @Field() sellPage: string;
  @Field() metadata: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
}
