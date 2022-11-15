import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Offers } from '../../offers.entity';
import {
  CreateOfferArgs,
  FindHotmartOffersArgs,
  IOfferRepository,
} from '../offer-repository.interface';

@Injectable()
export class CustomOfferRepository implements IOfferRepository {
  constructor(
    @InjectRepository(Offers)
    private readonly ormRepository: Repository<Offers>,
  ) {}

  async create(args: CreateOfferArgs): Promise<Offers> {
    const createdOffer = this.ormRepository.create(args);

    const offer = await this.ormRepository.save(createdOffer);

    return offer;
  }

  //Leave return type as any until we fix the entities relationship
  async findAllByExtensionId(extensionId: string): Promise<any[]> {
    const queryOffer = this.ormRepository
      .createQueryBuilder('offers')
      .select('offers.account_id', 'accountId')
      .addSelect('extension_id', 'extensionId')
      .addSelect('name', 'name')
      .addSelect('price', 'price')
      .addSelect('type', 'type')
      .addSelect('sellpage', 'sellpage')
      .addSelect('offers.created_at', 'createdAt')
      .addSelect('offers.updated_at', 'updatedAt')
      .innerJoin(
        'offer_courses',
        'offer_courses',
        'offers.id = offer_courses.offer_id',
      )
      .where('offers.extensionId = :extensionId', {
        extensionId,
      });

    const offers = await queryOffer.getRawMany();

    return offers;
  }

  //Leave return type as any until we fix the entities relationship
  async findAllHotmartOffers({
    accountId,
    off,
    prod,
  }: FindHotmartOffersArgs): Promise<any[]> {
    const offWhere = JSON.stringify({ offer_id: [off] });
    const prodWhere = JSON.stringify({ product_id: prod });

    const queryOfferCourses = this.ormRepository
      .createQueryBuilder('offers')
      .select('offers.id', 'id')
      .addSelect('offers.account_id', 'accountId')
      .addSelect('offerCourses.course_id', 'courseId')
      .addSelect('offerCourses.settings_type', 'settingsType')
      .addSelect('offerCourses.settings_version_id', 'settingsVersionId')
      .addSelect('offerCourses.settings_period', 'settingsPeriod')
      .addSelect('offers.metadata', 'metadata')
      .leftJoin(
        'offer_courses',
        'offerCourses',
        'offerCourses.offer_id = offers.id',
      )
      .where('offers.account_id = :accountId', {
        accountId,
      })
      .andWhere(
        new Brackets(qb => {
          qb.where(`offers.metadata ::jsonb @> '${offWhere}'`);
          qb.orWhere(`offers.metadata ::jsonb @> '${prodWhere}'`);
        }),
      );

    const offerCourses = await queryOfferCourses.getRawMany();

    return offerCourses;
  }

  //Leave return type as any until we fix the entities relationship
  async findOneHotmartOffer({
    accountId,
    prod,
    off,
  }: FindHotmartOffersArgs): Promise<any> {
    const offWhere = JSON.stringify({ offer_id: [off] });
    const prodWhere = JSON.stringify({ product_id: prod });

    const queryOffer = this.ormRepository
      .createQueryBuilder('offers')
      .where('offers.account_id = :accountId', {
        accountId,
      })
      //TODO: revisar offer_id e product_id da hotmart
      .andWhere(
        new Brackets(qb => {
          qb.where(`offers.metadata ::jsonb @> '${offWhere}'`);
          qb.orWhere(`offers.metadata ::jsonb @> '${prodWhere}'`);
        }),
      );

    const offer = await queryOffer.getRawOne();

    return offer;
  }
}
