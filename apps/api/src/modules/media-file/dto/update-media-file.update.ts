import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMediaFileInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  altText: string;

  @Field({ nullable: true })
  label: string;
}
