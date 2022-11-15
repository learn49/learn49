import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { Offers } from './dto/offers';
import { OfferInput } from './dto/offer.input';
import { OffersService } from './offers.service';
import { User } from '../users/dto/user';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Offers)
export class OffersResolvers {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Offers, { name: 'createOffer' })
  async createOffer(
    @Args('input') input: OfferInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    return this.offersService.create({
      accountId,
      userId,
      ...input,
    });
  }
}
