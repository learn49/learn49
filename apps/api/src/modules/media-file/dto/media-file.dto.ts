import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MediaFile {
  @Field(ID)
  id: string;

  @Field()
  accountId: string;

  @Field()
  url: string;

  @Field()
  size: number;

  @Field()
  altText: string;

  @Field()
  label: string;

  @Field()
  filename: string;
}
