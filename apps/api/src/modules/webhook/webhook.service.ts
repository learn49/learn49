import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { SendgridService } from '@/services/sendgrid.service';
import { UserService } from '../../modules/users/user.service';
import { generateHash } from '../../auth/auth';

import { ExtensionInstallation } from '@/modules/extension-installations/extension-installations.entity';
import { ExtensionInstallationWebhook } from '@/modules/extension-installations/extension-installations-webhook.entity';
import { Enrollment } from '@/modules/enrollment/enrollment.entity';
import { Token } from '@/modules/tokens/token.entity';
import { AppExceptions } from '@/utils/AppExceptions';
import { v4 as uuid } from 'uuid';
import { IOfferRepository } from '../offers/repositories/offer-repository.interface';

type CreateWebhookArgs = {
  idInstallation: string;
  webhookData: any;
};

type FindOrCreateStudentArgs = {
  accountId: string;
  user: {
    accountId: string;
    email: string;
    firstName: string;
    lastName: string;
    passwd: string;
  };
};

type CancelEnrollmentArgs = {
  accountId: string;
  userId: string;
  courseId: string;
  transactionId: string;
};

type GetHotmartOffers = {
  accountId: string;
  off: string;
  prod: string;
};

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(ExtensionInstallation)
    private readonly extensionInstallationRepository: Repository<
      ExtensionInstallation
    >,
    @InjectRepository(ExtensionInstallationWebhook)
    private readonly extensionInstallationWebhookRepository: Repository<
      ExtensionInstallationWebhook
    >,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @Inject('OFFER_REPOSITORY')
    private readonly offerRepository: IOfferRepository,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
    private readonly sendGrid: SendgridService,
  ) {}

  async create({ idInstallation, webhookData }: CreateWebhookArgs) {
    const queryExtensionInstallation = this.extensionInstallationRepository
      .createQueryBuilder('extension_installations')
      .select('extension_installations.id', 'id')
      .addSelect('extension_installations.account_id', 'accountId')
      .addSelect('extension_installations.active', 'active')

      .addSelect('extensions.name', 'name')
      .leftJoin(
        'extensions',
        'extensions',
        'extensions.id = extension_installations.extension_id',
      )
      .where('extension_installations.extension_id = :extensionId', {
        extensionId: idInstallation,
      });

    const extensionInstallation = await queryExtensionInstallation.getRawOne();

    if (!extensionInstallation) {
      throw AppExceptions.ExtensionNotInstalled;
    }

    if (!extensionInstallation.active) {
      throw AppExceptions.ExtensionDisabled;
    }

    const response = webhookData.status;
    const transaction = {
      transactionId: webhookData.transaction,
    };

    const createdExtensionInstallationWebhook = this.extensionInstallationWebhookRepository.create(
      {
        accountId: extensionInstallation.accountId,
        installationId: extensionInstallation.id,
        payload: webhookData,
        response,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    await this.extensionInstallationWebhookRepository.save(
      createdExtensionInstallationWebhook,
    );

    if (extensionInstallation.name.toLowerCase() === 'hotmart') {
      const { off, prod, status, email, last_name, first_name } = webhookData;

      const userData = {
        accountId: extensionInstallation.accountId,
        email,
        firstName: first_name,
        lastName: last_name,
        passwd: uuid(),
      };

      if (status === 'approved' || status === 'completed') {
        const user = await this.findOrCreateStudent({
          user: userData,
          accountId: extensionInstallation.accountId,
        });

        const offer = await this.offerRepository.findOneHotmartOffer({
          accountId: extensionInstallation.accountId,
          off,
          prod,
        });

        const offerCourses = await getManager().query(
          `SELECT * FROM offer_courses WHERE offer_id = '${offer.offers_id}';`,
        );

        if (offerCourses.length > 0) {
          const createEnrolmentPromise = offerCourses.map(async offerCourse => {
            await this.createEnrolment({
              user,
              accountId: extensionInstallation.accountId,
              transactionId: transaction.transactionId,
              courseId: offerCourse.course_id,
              courseVersionId: offerCourse.settings_version_id,
              period: offerCourse.settings_period,
              type: offerCourse.settings_type,
              labelId: null,
            });
          });

          await Promise.all(createEnrolmentPromise);
        }

        const labelOffers = await getManager().query(
          `SELECT * FROM label_offer WHERE offer_id = '${offer.offers_id}';`,
        );

        if (labelOffers.length > 0) {
          const createEnrolmentPromise = labelOffers.map(async labelOffer => {
            await this.createEnrolment({
              user,
              accountId: extensionInstallation.accountId,
              courseId: null,
              transactionId: transaction.transactionId,
              courseVersionId: null,
              period: labelOffer.period,
              type: labelOffer.type,
              labelId: labelOffer.label_id,
            });
          });

          await Promise.all(createEnrolmentPromise);
        }
      }

      if (
        status === 'canceled' ||
        status === 'refunded' ||
        status === 'expired' ||
        status === 'chargeback'
      ) {
        const offerCourses = await this.offerRepository.findAllHotmartOffers({
          accountId: extensionInstallation.accountId,
          off,
          prod,
        });

        const user = await this.findOrCreateStudent({
          user: userData,
          accountId: extensionInstallation.accountId,
        });

        if (offerCourses.length === 0) {
          throw new Error('Offers not found.');
        }

        const cancelEnrolmentPromise = offerCourses.map(async offerCourse => {
          await this.cancelEnrolment({
            accountId: extensionInstallation.accountId,
            userId: user.id,
            transactionId: transaction.transactionId,
            courseId: offerCourse.courseId,
          });
        });

        await Promise.all(cancelEnrolmentPromise);
      }
    }
  }

  private async findOrCreateStudent({
    user: userArgs,
    accountId,
  }: FindOrCreateStudentArgs) {
    let userAlreadyExists = false;

    let user = await this.userService.findUserByEmail({
      accountId,
      email: userArgs.email,
    });

    if (user) {
      userAlreadyExists = true;
    }

    if (!user) {
      user = await this.userService.createWithTransaction(userArgs);
      userAlreadyExists = false;
    }

    return { ...user, alreadyExists: userAlreadyExists };
  }

  private async createEnrolment({
    user,
    accountId,
    courseId,
    courseVersionId,
    transactionId,
    period,
    type,
    labelId,
  }) {
    const { id: userId, emails, alreadyExists } = user;

    const endDate = {
      oneMonth: new Date().setMonth(new Date().getMonth() + 1),
      oneYear: new Date().setFullYear(new Date().getFullYear() + 1),
      lifetime: null,
    };

    const isEnrolled = await this.enrollmentRepository.findOne({
      where: {
        userId,
        accountId,
        transactionId,
        courseId,
        status: 'active',
      },
    });

    if (isEnrolled) {
      return;
    }

    const createdEnrollment = this.enrollmentRepository.create({
      userId,
      accountId,
      courseId,
      courseVersionId,
      transactionId,
      type,
      status: 'active',
      canceledAt: null,
      startDate: new Date(),
      endDate:
        period !== 'lifetime' ? new Date(endDate[period]) : endDate[period],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const enrollment = await this.enrollmentRepository.save(createdEnrollment);

    if (labelId) {
      await getManager().query(
        `INSERT INTO label_enrollment VALUES ('${enrollment.id}', '${labelId}');`,
      );
    }

    const mainEmail = emails.find(email => email.main);

    if (!alreadyExists) {
      const createdToken = uuid();

      const expires = new Date();
      expires.setDate(expires.getDate() + 7);

      const ctoken = this.tokenRepository.create({
        accountId,
        userId,
        token: generateHash(createdToken),
        scope: 'create_password',
        expiresIn: expires,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const token = await this.tokenRepository.save(ctoken);

      // const sendGridParams = {
      //   name: `${firstName} ${lastName}`,
      //   course: title,
      //   email: mainEmail.email,
      //   activatedCode: `${token.id}/${createdToken}`,
      // };

      // await this.sendGrid.userEnrollment(sendGridParams);
    }

    // TODO: se alreadyExists apenas envia email sem link para criação de senha
  }

  private async cancelEnrolment({
    accountId,
    userId,
    courseId,
    transactionId,
  }: CancelEnrollmentArgs) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        accountId,
        userId,
        courseId,
        transactionId,
        status: 'active',
      },
    });

    if (!enrollment) {
      return;
    }

    enrollment.status = 'canceled';
    enrollment.canceledAt = new Date();
    enrollment.updatedAt = new Date();

    await this.enrollmentRepository.save(enrollment);

    return enrollment;
  }
}
