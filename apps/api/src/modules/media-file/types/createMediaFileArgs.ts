import { FileUpload } from 'graphql-upload';

export type CreateMediaFileArgs = {
  accountId: string;
  file: FileUpload;
  altText: string;
  label: string[];
};
