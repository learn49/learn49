import { Inject, Injectable } from '@nestjs/common';
import { SendgridService } from '../../services/sendgrid.service';
import { sign, generateHash } from '../../auth/auth';

import { uploadFile } from '../../utils/upload-file';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../tokens/token.entity';
import { AppExceptions } from '@/utils/AppExceptions';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from './repositories/user-repository.interface';
import { IUserRoleRepository } from './repositories/user-role-repository.interface';
import { Enrollment } from '../enrollment/enrollment.entity';
import {
  AuthArgs,
  CreateArgs,
  CreateWithTransaction,
  FindAllArgs,
  FindOneArgs,
  FindUserByEmail,
  GetMeArgs,
  ResetPassword,
  UpdateArgs,
  UpdatePassword,
  UpdateProfilePicture,
  UserConfirmation,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Enrollment)
    private readonly ormRepository: Repository<Enrollment>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    @Inject('USER_ROLE_REPOSITORY')
    private readonly userRoleRepository: IUserRoleRepository,
    private readonly sendGrid: SendgridService,
  ) { }

  async _findEnrollmentsByUserId({ accountId, userId }: FindOneArgs) {
    const queryEnrollment = this.ormRepository
      .createQueryBuilder('enrollments')
      .select('enrollments.id', 'id')
      .addSelect('labels.id', 'id')
      .addSelect('labels.label', 'label')
      .addSelect('labels.is_private', 'isPrivate')
      .innerJoin(
        'label_enrollment',
        'label_enrollment',
        'enrollments.id = label_enrollment.enrollment_id',
      )
      .innerJoin('labels', 'labels', 'label_enrollment.label_id = labels.id')
      .where('enrollments.account_id = :accountId', {
        accountId,
      })
      .andWhere('enrollments.user_id = :userId', {
        userId,
      });

    return queryEnrollment.getRawMany();
  }

  async auth({ accountId, email, passwd }: AuthArgs) {
    const user = await this.userRepository.findOneByAccountIdAndEmail({
      accountId,
      email,
    });

    if (!user) throw AppExceptions.AccessDenied;
    if (!bcrypt.compareSync(passwd, user.passwd)) {
      throw AppExceptions.AccessDenied;
    }

    const searchParams = { userId: user.id, accountId };
    const userRole = await this.userRoleRepository.findOneByAccountIdAndUserId(
      searchParams,
    );
    if (!userRole) throw AppExceptions.UserRoleNotFound;

    const enrollments = await this._findEnrollmentsByUserId(searchParams);
    const userPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      role: userRole.role,
      enrollments,
    };
    return {
      user: { ...userPayload, email },
      token: sign({ ...userPayload, accountId }),
    };
  }

  async getMe({ accountId, userId }: GetMeArgs) {
    const search = { accountId, userId };
    const user = await this.userRepository.findOneByAccountIdAndUserId(search);
    const enrollments = await this._findEnrollmentsByUserId(search);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      enrollments,
    };
  }

  async findAll({ accountId, name, limit, offset }: FindAllArgs) {
    const users = await this.userRepository.findAll({
      accountId,
      name,
      limit,
      offset,
    });

    const totalCount = await this.userRepository.count(accountId);

    return {
      users,
      totalCount,
    };
  }

  async findOne({ accountId, userId }: FindOneArgs) {
    const user = await this.userRepository.findOneByAccountIdAndUserId({
      accountId,
      userId,
    });

    return {
      user,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      emails: user.emails,
      role: user.role,
    };
  }

  async create({
    accountId,
    firstName = null,
    lastName = null,
    email,
    passwd,
  }: CreateArgs) {
    const users = await this.userRepository.findOneByAccountIdAndEmail({
      accountId,
      email,
    });

    if (users) {
      throw AppExceptions.EmailIsAlreadyInUse;
    }

    const user = await this.userRepository.create({
      accountId,
      firstName,
      lastName,
      emails: [
        {
          email: email,
          verified: true,
          main: true,
        },
      ],
      passwd: generateHash(passwd),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const createdToken = uuid();

    const tokenCreated = this.tokenRepository.create({
      accountId: accountId,
      userId: user.id,
      token: generateHash(createdToken),
      scope: 'created_user',
      expiresIn: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = await this.tokenRepository.save(tokenCreated);

    await this.userRoleRepository.create({
      accountId,
      userId: user.id,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const sendGridParams = {
      email,
      passwd,
      activatedCode: `${token.id}/${createdToken}`,
    };

    await this.sendGrid.welcomeUser(sendGridParams);

    return {
      id: user.id,
      emails: user.emails,
    };
  }

  async createWithTransaction({
    accountId,
    firstName = null,
    lastName = null,
    email,
    passwd,
  }: CreateWithTransaction) {
    const userEmailIsAlreadyInUse = await this.userRepository.findOneByAccountIdAndEmail(
      {
        accountId,
        email,
      },
    );

    if (userEmailIsAlreadyInUse) {
      throw AppExceptions.EmailIsAlreadyInUse;
    }

    const user = await this.userRepository.create({
      accountId,
      firstName,
      lastName,
      emails: [
        {
          email: email,
          verified: true,
          main: true,
        },
      ],
      passwd: generateHash(passwd),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const createdToken = uuid();

    const tokenCreated = this.tokenRepository.create({
      accountId,
      userId: user.id,
      token: generateHash(createdToken),
      scope: 'created_user',
      expiresIn: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = await this.tokenRepository.save(tokenCreated);

    await this.userRoleRepository.create({
      accountId,
      userId: user.id,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const sendGridParams = {
      email,
      passwd,
      activatedCode: `${token.id}/${createdToken}`,
    };

    //await this.sendGrid.welcomeUser(sendGridParams);

    return user;
  }

  async userConfirmation({ accountId, tokenId, plainToken }: UserConfirmation) {
    const token = await this.tokenRepository.findOne({
      where: {
        id: tokenId,
        accountId,
      },
    });

    if (token.usedAt) {
      throw AppExceptions.TokenHasAlreadyBeenUsed;
    }

    if (Date.now().valueOf > token.expiresIn.valueOf) {
      throw AppExceptions.TokenHasAlreadyExpired;
    }

    if (!bcrypt.compareSync(plainToken, token.token)) {
      throw AppExceptions.InvalidToken;
    }

    const usedToken = {
      usedAt: new Date(),
      updatedAt: new Date(),
    };

    const user = await this.userRepository.findOneByUserId(token.userId);

    const emails = user.emails.map(email => {
      if (email.main) {
        return {
          ...email,
          verified: true,
        };
      }

      return email;
    });

    user.emails = emails;

    await this.userRepository.save(user);

    await this.tokenRepository.update({ id: tokenId, accountId }, usedToken);

    return {
      id: token.userId,
    };
  }

  async update({ accountId, userId, email, firstName, lastName }: UpdateArgs) {
    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (email) {
      const emails = user.emails.map(getEmail =>
        getEmail.main ? { ...getEmail, email } : getEmail,
      );
      user.emails = emails;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    user.updatedAt = new Date();

    await this.userRepository.save(user);

    return {
      ...user,
      email: user.emails[0].email, // TODO: Temporary added (waiting for real use of email)
    };
  }

  async updatePassword({
    accountId,
    userId,
    currentPasswd,
    newPasswd,
    confirm,
  }: UpdatePassword) {
    if (newPasswd !== confirm) {
      throw AppExceptions.PasswordNotMatch;
    }

    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (!bcrypt.compareSync(currentPasswd, user.passwd)) {
      throw AppExceptions.InvalidPassword;
    }

    user.passwd = generateHash(newPasswd);
    user.updatedAt = new Date();

    await this.userRepository.save(user);

    return {
      id: user.id,
      emails: user.emails,
    };
  }

  async forgotPassword({
    accountId,
    email,
  }: Pick<AuthArgs, 'accountId' | 'email'>) {
    const user = await this.userRepository.findOneByAccountIdAndEmail({
      accountId,
      email,
    });

    if (!user) {
      throw AppExceptions.UserNotFound;
    }

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    const createdToken = uuid();

    const tokenCreated = this.tokenRepository.create({
      accountId,
      userId: user.id,
      token: generateHash(createdToken),
      scope: 'reset_password',
      expiresIn: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = await this.tokenRepository.save(tokenCreated);

    const sendGridParams = {
      subject: 'Recuperação de Senha',
      email,
      activatedCode: `${token.id}/${createdToken}`,
    };

    // TODO: Need validate email sending process
    await this.sendGrid.forgotPasswd(sendGridParams);
    return email;
  }

  async resetPassword({
    accountId,
    tokenId,
    plainToken,
    passwd,
    confirmPasswd,
  }: ResetPassword) {
    if (passwd !== confirmPasswd) {
      throw AppExceptions.PasswordConfirmationIsNotCorrect;
    }

    const token = await this.tokenRepository.findOne({
      where: { id: tokenId, accountId },
    });

    if (!token) {
      throw AppExceptions.InvalidToken;
    }

    if (token.usedAt) {
      throw AppExceptions.TokenHasAlreadyBeenUsed;
    }

    if (Date.now().valueOf > token.expiresIn.valueOf) {
      throw AppExceptions.TokenHasAlreadyBeenUsed;
    }

    if (!bcrypt.compareSync(plainToken, token.token)) {
      throw AppExceptions.InvalidToken;
    }

    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId: token.userId,
      accountId,
    });

    if (!user) {
      throw AppExceptions.UserNotFound;
    }

    const emails = user.emails.map(email => {
      if (email.main) {
        return {
          ...email,
          verified: true,
        };
      }

      return email;
    });

    user.passwd = generateHash(passwd);
    user.emails = emails;
    user.updatedAt = new Date();

    const usedToken = {
      usedAt: new Date(),
      updatedAt: new Date(),
    };

    await this.userRepository.save(user);

    await this.tokenRepository.update({ id: tokenId, accountId }, usedToken);

    return {
      id: token.userId,
    };
  }

  async updateProfilePicture({
    accountId,
    userId,
    file,
  }: UpdateProfilePicture) {
    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (!user) {
      throw AppExceptions.UserNotFound;
    }

    const { createReadStream, filename, mimetype } = await file;

    const { url } = await uploadFile({
      createReadStream,
      filename,
      mimetype,
    });

    user.profilePicture = url;
    user.updatedAt = new Date();

    await this.userRepository.save(user);

    return user;
  }

  async findUserByEmail({ accountId, email }: FindUserByEmail) {
    const user = this.userRepository.findOneByAccountIdAndEmail({
      accountId,
      email,
    });

    return user;
  }

  async disable({ accountId, userId, deleteUserId }) {
    const userRole = await this.userRoleRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (!userRole) {
      throw AppExceptions.UserRoleNotFound;
    }

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const user = await this.userRepository.findOneByAccountIdAndUserId({
      userId: deleteUserId,
      accountId,
    });

    if (!user) {
      throw AppExceptions.UserNotFound;
    }

    user.active = false;
    user.updatedAt = new Date();

    await this.userRepository.save(user);

    return user;
  }
}
