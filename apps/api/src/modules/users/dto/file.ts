import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  encoding: string;
}
