import { Extension } from '../extensions/extensions.entity';
import { ExtensionInstallation } from './extension-installations.entity';

export interface CreateExtensionInstallationArgs {
  extensionId: string;
  accountId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindOneBy {
  accountId: string;
  extensionId: string;
}

export interface FindOne {
  accountId: string;
  extensionId: string;
}

export interface IExtensionInstallation {
  create(args: CreateExtensionInstallationArgs): Promise<ExtensionInstallation>;
  findOneBy(args: FindOneBy): Promise<ExtensionInstallation>;
  findOne(args: FindOne): Promise<ExtensionInstallation | Extension>;
  delete(id: string): Promise<void>;
}
