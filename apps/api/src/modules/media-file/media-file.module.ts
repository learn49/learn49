import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaFile } from './media-file.entity';
import { MediaFileService } from './media-file.service';
import { CustomMediaFileRepository } from './repositories/typeorm/media-file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile])],
  providers: [
    MediaFileService,
    {
      provide: 'MEDIA_FILE_REPOSITORY',
      useClass: CustomMediaFileRepository,
    },
  ],
})
export class MediaFileModule {}
