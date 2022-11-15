import { AppExceptions } from '@/utils/AppExceptions';
import { Injectable, Inject } from '@nestjs/common';
import { IOfferRepository } from '../offers/repositories/offer-repository.interface';
import { IUserRepository } from '../users/repositories/user-repository.interface';
import { IExtensionInstallation } from './extension-installations.interface';
import { CreateExtension } from './types';

@Injectable()
export class ExtensionInstallationService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    @Inject('OFFER_REPOSITORY')
    private readonly offerRepository: IOfferRepository,
    @Inject('EXTENSION_INSTALLATION_REPOSITORY')
    private readonly extensionInstallationRepository: IExtensionInstallation,
  ) { }

  //TODO: add settings
  async create({ accountId, extensionId, userId }: CreateExtension) {
    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (!user) {
      throw AppExceptions.AccessDenied;
    }

    await this.extensionInstallationRepository.create({
      extensionId,
      accountId,
      //owner_id: user_id,
      active: false,
      //       permission_values: JSON.stringify(permission_values),
      //settings_values: JSON.stringify(settings),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { id: extensionId };
  }

  // async findAll({ account_id }) {
  //   const extensionInstallations = await this.knex('extension_installations')
  //     .where({
  //       account_id
  //     })
  //     .select('*');

  //   return extensionInstallations;
  // }

  async findOne({ accountId, extensionId }) {
    const extensionInstallation = await this.extensionInstallationRepository.findOne(
      {
        accountId,
        extensionId,
      },
    );

    const offers = await this.offerRepository.findAllByExtensionId(extensionId);

    const resultData = {
      ...extensionInstallation,
      offers: [...offers],
    };

    return resultData;
  }

  // async update({ account_id, extension_installation_id, ...input }) {
  //   const [extensionInstallation] = await this.knex('extension_installations')
  //     .where({
  //       account_id
  //     })
  //     .andWhere({
  //       id: extension_installation_id
  //     })
  //     .update({
  //       ...input,
  //       updated_at: new Date()
  //     })
  //     .returning('*');

  //   return extensionInstallation;
  // }

  async delete({
    accountId,
    extensionId,
  }: Pick<CreateExtension, 'accountId' | 'extensionId'>) {
    // TODO: Anexar uma restrição para apagar as extension_installations_webhook vinculadas.

    const extensionInstallation = await this.extensionInstallationRepository.findOneBy(
      {
        accountId,
        extensionId,
      },
    );

    if (!extensionInstallation) {
      throw new Error('extension installation deleted');
    }

    await this.extensionInstallationRepository.delete(extensionInstallation.id);

    return 'extension installation deleted';
  }
}
