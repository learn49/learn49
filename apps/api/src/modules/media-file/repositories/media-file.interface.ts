import { MediaFile } from '../media-file.entity';

export interface CreateMediaFileArgs {
  accountId: string;
  url: string;
  size: number;
  altText: string;
  label: string;
  filename: string;
}

export interface FindOneMediaFileArgs {
  id?: string;
  accountId?: string;
}

export interface FindAllMediaFileArgs {
  accountId?: string;
}

export interface IMediaFileRepository {
  create(args: CreateMediaFileArgs): Promise<MediaFile>;
  save(args: MediaFile): Promise<MediaFile>;
  findOne(args: FindOneMediaFileArgs): Promise<MediaFile | undefined>;
  findAll(args: FindAllMediaFileArgs): Promise<MediaFile[]>;
  remove(args: MediaFile): Promise<void>;
}
