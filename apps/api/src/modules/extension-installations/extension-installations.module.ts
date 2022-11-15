import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offers } from '../offers/offers.entity';
import { CustomOfferRepository } from '../offers/repositories/typeorm/offer.repository';
import { CustomUserRepository } from '../users/repositories/typeorm/user.repository';
import { User } from '../users/user.entity';
import { CustomExtensionInstallationRepository } from './extension-installations.repository';
import { ExtensionInstallation } from './extension-installations.entity';
import { ExtensionInstallationResolvers } from './extension-installations.resolvers';
import { ExtensionInstallationService } from './extension-installations.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Offers, ExtensionInstallation])],

  providers: [
    ExtensionInstallationResolvers,
    ExtensionInstallationService,
    {
      provide: 'OFFER_REPOSITORY',
      useClass: CustomOfferRepository,
    },
    {
      provide: 'EXTENSION_INSTALLATION_REPOSITORY',
      useClass: CustomExtensionInstallationRepository,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: CustomUserRepository,
    },
  ],
})
export class ExtensionInstallationModule { }
