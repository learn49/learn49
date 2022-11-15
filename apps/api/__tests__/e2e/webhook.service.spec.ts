import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExtensionInstallationWebhook } from '@/modules/extension-installations/extension-installations-webhook.entity';
import { getConnection, Repository } from 'typeorm';
import {
  webHookApprovedTransHP02,
  webHookCompletedTransHP02,
  webHookApprovedTransHP01,
  webHookCanceledTransHP01,
} from '../mock/service/webhook.service.mock';
import { Enrollment } from '@/modules/enrollment/enrollment.entity';
import { sqlBaseInserts } from '../sql/base-sql';

let app: INestApplication;
let extensionInstallationWebhook: Repository<ExtensionInstallationWebhook>;
let enrollmentRepository: Repository<Enrollment>;

const clearTables = async () => {
  const entities = [
    'extension_installations_webhooks',
    'label_enrollment',
    'enrollments',
    'users',
    'tokens',
  ];

  for (const entity of entities) {
    const manager = getConnection();
    await manager.query(`delete from  "${entity}"`);
  }
};

const createBaseData = async () => {
  for (const sqlBaseInsert of sqlBaseInserts) {
    const manager = getConnection();
    await manager.query(sqlBaseInsert);
  }
};

beforeAll(async () => {
  // await createBaseData();
});

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  extensionInstallationWebhook = module.get(
    getRepositoryToken(ExtensionInstallationWebhook),
  );

  enrollmentRepository = module.get(getRepositoryToken(Enrollment));

  app = module.createNestApplication();
  await app.init();
  clearTables();
});

afterEach(async () => {
  await app.close();
});

afterAll(async done => {
  setImmediate(done);
});

it('should be able create enrollment', async () => {
  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookApprovedTransHP02);

  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookCompletedTransHP02);

  const extension = await extensionInstallationWebhook.find({
    where: `payload ::jsonb @> '{"transaction":"${webHookApprovedTransHP02.transaction}"}'`,
  });
  const enrollment = await enrollmentRepository.findOne({
    where: { transactionId: webHookApprovedTransHP02.transaction },
  });

  expect(extension[0].response).toBe('approved');
  expect(extension[1].response).toBe('completed');
  expect(enrollment.transactionId).toBe(enrollment.transactionId);
  expect(enrollment.status).toBe('active');
});

it('should be able create enrollment', async () => {
  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookApprovedTransHP02);

  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookCompletedTransHP02);

  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookCompletedTransHP02);

  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookApprovedTransHP01);

  await request(app.getHttpServer())
    .post('/extensions/1aa561d0-25ac-488c-b3c9-f997c8450e2a/webhook')
    .send(webHookCanceledTransHP01);

  const extension = await extensionInstallationWebhook.find({
    where: `payload ::jsonb @> '{"transaction":"${webHookApprovedTransHP02.transaction}"}'`,
  });
  const enrollmentTransHP02 = await enrollmentRepository.findOne({
    where: { transactionId: webHookApprovedTransHP02.transaction },
  });

  const enrollmentTransHP01 = await enrollmentRepository.findOne({
    where: { transactionId: webHookApprovedTransHP01.transaction },
  });

  expect(extension[0].response).toBe('approved');
  expect(extension[1].response).toBe('completed');
  expect(enrollmentTransHP02.transactionId).toBe(
    enrollmentTransHP02.transactionId,
  );

  expect(enrollmentTransHP01.status).toBe('canceled');
  expect(enrollmentTransHP02.status).toBe('active');
});
