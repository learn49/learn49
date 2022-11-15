import { Offers } from '../offers.entity';

export interface CreateOfferArgs {
  extensionId: string;
  accountId: string;
  name: string;
  price: string;
  type: string;
  sellPage: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindHotmartOffersArgs {
  accountId: string;
  off: string;
  prod: string;
}

export interface IOfferRepository {
  create(args: CreateOfferArgs): Promise<Offers>;
  findAllByExtensionId(extensionId: string): Promise<any[]>;
  findAllHotmartOffers(args: FindHotmartOffersArgs): Promise<any[]>;
  findOneHotmartOffer(args: FindHotmartOffersArgs): Promise<any>;
}
