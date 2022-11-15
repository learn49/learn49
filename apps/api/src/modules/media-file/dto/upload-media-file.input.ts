import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UploadMediaFileInput {
  @Field()
  accountId: string;

  @Field(GraphQLUpload)
  file: FileUpload;

  @Field()
  altText: string;

  @Field(() => [String])
  label: string[];
}
