import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from '../../media-file.entity';
import {
  CreateMediaFileArgs,
  FindAllMediaFileArgs,
  FindOneMediaFileArgs,
  IMediaFileRepository,
} from '../media-file.interface';

@Injectable()
export class CustomMediaFileRepository implements IMediaFileRepository {
  constructor(
    @InjectRepository(MediaFile)
    private readonly ormRepository: Repository<MediaFile>,
  ) { }

  async create(args: CreateMediaFileArgs): Promise<MediaFile> {
    const createdMediaFile = this.ormRepository.create(args);

    return await this.ormRepository.save(createdMediaFile);
  }

  async findOne({
    id,
    accountId,
  }: FindOneMediaFileArgs): Promise<MediaFile | undefined> {
    let query = this.ormRepository.createQueryBuilder('mediaFiles');

    if (id) {
      query = query.andWhere('mediaFiles.id = :id', {
        id,
      });
    }

    if (accountId) {
      query = query.andWhere('mediaFiles.account_id = :accountId', {
        accountId,
      });
    }

    return await query.getOne();
  }

  async findAll({ accountId }: FindAllMediaFileArgs): Promise<MediaFile[]> {
    let query = this.ormRepository.createQueryBuilder('mediaFiles');

    if (accountId) {
      query = query.andWhere('mediaFiles.account_id = :accountId', {
        accountId,
      });
    }

    return await query.getMany();
  }

  async save(args: MediaFile): Promise<MediaFile> {
    return await this.ormRepository.save(args);
  }

  async remove(args: MediaFile): Promise<void> {
    await this.ormRepository.remove(args);
  }
}
