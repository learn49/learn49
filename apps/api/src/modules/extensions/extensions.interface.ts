import { Extension } from './extensions.entity';

export interface CreateExtensionArgs {
  accountId: string;
  userId: string;
  name: string;
  developerId: string;
  version?: number;
  permissions?: string;
  settings?: string;
  scopes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindAllExtensionArgs {
  id?: string;
}

export interface IExtensionsRepository {
  findAll(args?: FindAllExtensionArgs): Promise<Extension[]>;
  create(input: Omit<CreateExtensionArgs, 'accountId'>): Promise<Extension>;
}
