import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Label {
  @Field(() => ID)
  id: string;

  @Field()
  label: string;

  @Field({ nullable: true })
  isPrivate: boolean;
}
