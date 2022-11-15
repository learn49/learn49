import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { ExtensionInstallation } from './dto/extension-installation';
import { ExtensionInstallationService } from './extension-installations.service';
import { User } from '../users/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(() => ExtensionInstallation)
export class ExtensionInstallationResolvers {
  constructor(
    private readonly extensionInstallationService: ExtensionInstallationService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ExtensionInstallation, {
    name: 'createExtensionInstallation',
  })
  async createExtensionInstallation(
    @Args('extensionId') extensionId: string,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id: user_id } = user;
    return this.extensionInstallationService.create({
      accountId: accountId,
      extensionId: extensionId,
      userId: user_id,
    });
  }

  // @UseGuards(AuthGuard)
  // @Query(() => [ExtensionInstallation], { name: 'getAllExtensionInstallations' })
  // async getAllExtensionInstallations(
  //   @Args('account_id') account_id: string,
  // ) {
  //   return this.extensionInstallationService.findAll({ account_id });
  // }

  @UseGuards(AuthGuard)
  @Query(() => ExtensionInstallation, {
    name: 'getExtensionInstallation',
    nullable: true,
  })
  async getExtensionInstallation(
    @Args('accountId') account_id: string,
    @Args('extensionId') extension_id: string,
  ) {
    return this.extensionInstallationService.findOne({
      accountId: account_id,
      extensionId: extension_id,
    });
  }

  // @UseGuards(AuthGuard)
  // @Mutation(() => ExtensionInstallation, { name: 'updateExtensionInstallation', nullable: true })
  // async updateExtensionInstallation(
  //   @Args('account_id') account_id: string,
  //   @Args('extension_installation_id') extension_installation_id: string,
  //   @Args('input') input: ExtensionInstallationUpdateInput,
  // ) {
  //   return this.extensionInstallationService.update({
  //     account_id,
  //     extension_installation_id,
  //     ...input
  //   });
  // }

  @UseGuards(AuthGuard)
  @Mutation(() => String, { name: 'deleteExtensionInstallation' })
  async deleteExtensionInstallation(
    @Args('accountId') account_id: string,
    @Args('extensionId') extension_id: string,
  ) {
    return await this.extensionInstallationService.delete({
      accountId: account_id,
      extensionId: extension_id,
    });
  }
}
