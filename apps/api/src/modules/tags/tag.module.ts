import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTagRepository } from './repositories/typeorm/tag.repository';

import { Tag } from './tag.entity';
import { TagResolver } from './tag.resolvers';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],

  providers: [
    TagResolver,
    TagService,
    {
      provide: 'TAG_REPOSITORY',
      useClass: CustomTagRepository,
    },
  ],
})
export class TagModule {}
