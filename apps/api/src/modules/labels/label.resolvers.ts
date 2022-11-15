import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';

import { LabelService } from './label.service';
import { AuthGuard } from '@/auth/authGuard';
import { Label } from './dto/label';
import { LabelInput } from './dto/label.input';

@UseInterceptors(SentryInterceptor)
@Resolver(Label)
export class LabelResolver {
  constructor(private readonly labelService: LabelService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Label, { name: 'createLabel' })
  async createLabel(
    @Args('input') input: LabelInput,
    @Args('accountId') accountId: string,
  ) {
    const label = await this.labelService.create({
      accountId,
      ...input,
    });

    return label;
  }

  //@UseGuards(AuthGuard)
  @Query(() => [Label], { name: 'getLabelsByAccount' })
  async getLabelsByAccount(@Args('accountId') accountId: string) {
    const labels = await this.labelService.findByAccount({
      accountId,
    });

    return labels;
  }
}
