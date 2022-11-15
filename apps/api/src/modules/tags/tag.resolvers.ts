import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { Tag } from './dto/tag';
import { TagInput } from './dto/tag.input';
import { TagService } from './tag.service';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard)
  @Query(() => [Tag], { name: 'getAllTags', nullable: true })
  async getAllTags(
    @Args('accountId') accountId: string,
    @Args('input') input: TagInput,
  ) {
    return this.tagService.findAll({ accountId, ...input });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag, { name: 'createTag' })
  async createTag(
    @Args('accountId') accountId: string,
    @Args('input') input: TagInput,
  ) {
    return this.tagService.create({ accountId, ...input });
  }
}
