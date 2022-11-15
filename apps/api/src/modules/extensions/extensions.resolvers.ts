import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/authGuard';
import { Extension } from './dto/extension';
import { Extensions } from './dto/extensions';
import { ExtensionInput } from './dto/extension.input';
import { User } from '@/modules/users/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '@/sentry.interceptor';
import { ExtensionService } from './extensions.service';
import { CustomFieldExtension } from './providers/custom-field.extension';
import { WriteCustomFieldsInput } from './dto/WriteCustomFieldInput';
import graphqlTypeJson from 'graphql-type-json';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Extension)
export class ExtensionsResolvers {
  constructor(
    private readonly extensionService: ExtensionService,
    private readonly customFieldExtension: CustomFieldExtension,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Extension, { name: 'createExtension' })
  async createExtension(
    @Args('input') input: ExtensionInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: user_id } = user;
    return this.extensionService.create({
      accountId,
      userId: user_id,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => graphqlTypeJson)
  async writeCustomField(
    @Args('input') input: WriteCustomFieldsInput,
    @Args('accountId') accountId: string,
  ) {
    return this.customFieldExtension.write({
      accountId,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => [Extensions], { name: 'getAllExtensions' })
  async getAllExtensions() {
    return this.extensionService.findAll();
  }
}
