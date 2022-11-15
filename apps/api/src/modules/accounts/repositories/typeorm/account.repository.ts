import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../account.entity';
import { IAccountRepository } from '../account-repository.interface';

@Injectable()
export class CustomAccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly ormRepository: Repository<Account>,
  ) {}

  async findOneBySubdomain(subdomain: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne({
      where: {
        subdomain,
      },
    });

    return account;
  }

  async findOneById(id: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return account;
  }

  async create(subdomain: string): Promise<Account> {
    const createdAccount = this.ormRepository.create({
      subdomain,
    });

    const account = await this.ormRepository.save(createdAccount);

    return account;
  }

  async save(account: Account): Promise<Account> {
    const savedAccount = await this.ormRepository.save(account);

    return savedAccount;
  }
}
