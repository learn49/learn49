import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageDto {
  @Field()
  content: string;
}
