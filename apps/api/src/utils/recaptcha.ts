import axios from 'axios';
import * as qs from 'qs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@/modules/accounts/account.entity';
import { Repository } from 'typeorm';
import { AppExceptions } from './AppExceptions';

interface Form {
  secret: string;
  response: string;
}
@Injectable()
export class RecaptchaService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
  async validate(value: string, accountId?: string): Promise<boolean> {
    const form: Form = {
      secret: '',
      response: '',
    };

    if (accountId) {
      const account = await this.accountRepository.findOne({
        where: {
          id: accountId,
        },
      });

      form.secret = account.recaptchaSecret
        ? account.recaptchaSecret
        : process.env.RECAPTCHA_KEY;
    } else {
      form.secret = process.env.RECAPTCHA_KEY;
    }

    if (form.secret === '--bypass--') {
      return true;
    }

    const url = 'https://www.google.com/recaptcha/api/siteverify';
    form.response = value;
    const data = await axios.post(url, qs.stringify(form));
    if (data.data && !data.data.success) {
      throw AppExceptions.InvalidCaptcha;
    }
    return true;
  }
}
