import { AuthGuard } from '@/auth/authGuard';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MediaFile } from './dto/media-file.dto';
import { UpdateMediaFileInput } from './dto/update-media-file.update';
import { UploadMediaFileInput } from './dto/upload-media-file.input';

import { MediaFileService } from './media-file.service';

@Resolver(MediaFile)
export class MediaFileResolver {
  constructor(
    @Inject()
    private readonly mediaFileService: MediaFileService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => MediaFile)
  async getMediaFile(
    @Args('accountId') accountId: string,
    @Args('id') id: string,
  ) {
    return await this.mediaFileService.findOne({
      id,
      accountId,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => [MediaFile])
  async getMediaFiles(@Args('accountId') accountId: string) {
    return await this.mediaFileService.findAll({
      accountId,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MediaFile)
  async uploadMediaFile(
    @Args('accountId') accountId: string,
    @Args('input') input: UploadMediaFileInput,
  ) {
    return await this.mediaFileService.create({
      accountId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MediaFile)
  async updateMediaFile(
    @Args('accountId') accountId: string,
    @Args('input') input: UpdateMediaFileInput,
  ) {
    return await this.mediaFileService.update({
      accountId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async removeMediaFile(
    @Args('accountId') accountId: string,
    @Args('id') id: string,
  ) {
    return await this.mediaFileService.remove({
      accountId,
      id,
    });
  }
}
