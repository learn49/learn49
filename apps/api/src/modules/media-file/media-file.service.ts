import { Inject, Injectable } from '@nestjs/common';
import { MediaFile } from './media-file.entity';
import { IMediaFileRepository } from './repositories/media-file.interface';
import { uploadFile, removeFile } from '@/utils/upload-file';
import { AppExceptions } from '@/utils/AppExceptions';
import {
  CreateMediaFileArgs,
  FindAllMediaFileArgs,
  FindOneMediaFileArgs,
  UpdateMediaFileArgs,
} from './types';

@Injectable()
export class MediaFileService {
  constructor(
    @Inject('MEDIA_FILE_REPOSITORY')
    private readonly mediaFileRepository: IMediaFileRepository,
  ) { }

  async create({
    accountId,
    altText,
    label,
    file,
  }: CreateMediaFileArgs): Promise<MediaFile> {
    const { url, filename } = await uploadFile(file);

    const mediaFile = await this.mediaFileRepository.create({
      accountId,
      filename,
      url,
      size: 0,
      altText,
      label: JSON.stringify(label),
    });

    return mediaFile;
  }

  async findOne({ id, accountId }: FindOneMediaFileArgs): Promise<MediaFile> {
    const mediaFile = await this.mediaFileRepository.findOne({
      id,
      accountId,
    });

    if (!mediaFile) throw AppExceptions.MediaFileNotFound;

    return mediaFile;
  }

  async findAll({ accountId }: FindAllMediaFileArgs): Promise<MediaFile[]> {
    const mediaFiles = await this.mediaFileRepository.findAll({
      accountId,
    });

    return mediaFiles;
  }

  async update({
    id,
    accountId,
    altText,
    label,
  }: UpdateMediaFileArgs): Promise<MediaFile> {
    const mediaFile = await this.mediaFileRepository.findOne({
      id,
      accountId,
    });

    if (!mediaFile) throw AppExceptions.MediaFileNotFound;

    if (altText) mediaFile.altText = altText;
    if (label) mediaFile.label = label;

    await this.mediaFileRepository.save(mediaFile);

    return mediaFile;
  }

  async remove({ id, accountId }): Promise<MediaFile> {
    const mediaFile = await this.mediaFileRepository.findOne({
      id,
      accountId,
    });

    if (!mediaFile) throw AppExceptions.MediaFileNotFound;

    await this.mediaFileRepository.remove(mediaFile);

    await removeFile(mediaFile.filename);

    return id;
  }
}
