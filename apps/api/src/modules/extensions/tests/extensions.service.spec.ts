import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExtensionInstallation } from '../../extension-installations/extension-installations.entity';
import { UserRole } from '../../users/user-role.entity';
import { Extension } from '../extensions.entity';
import { ExtensionService } from '../extensions.service';

describe.skip('ExtensionService', () => {
  let service: ExtensionService;

  const mockRepositoryExtensionInstallation = {
    save: jest.fn(),
  };
  const mockRepositoryExtensionModules = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      execute: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockReturnThis(),
    })),
  };

  const mockRepositoryUserRole = {
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExtensionService,
        {
          provide: getRepositoryToken(ExtensionInstallation),
          useValue: mockRepositoryExtensionInstallation,
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: mockRepositoryUserRole,
        },
        {
          provide: getRepositoryToken(Extension),
          useValue: mockRepositoryExtensionModules,
        },
      ],
    }).compile();

    service = module.get<ExtensionService>(ExtensionService);
  });

  it('should  definde', async () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    //FIXME: broken test
    // it('Should be able create a new extension', async () => {
    //   const userRole = {
    //     role: 'owner',
    //   };
    //   const extension = {
    //     id: 'valid_id',
    //     name: 'valid_name',
    //   } as Extension;
    //   mockRepositoryUserRole.findOne.mockReturnValue(userRole);
    //   mockRepositoryExtensionModules.create.mockReturnValue(extension);
    //   mockRepositoryExtensionModules.save.mockReturnValue(extension);
    //   const extenssionNew = await service.create({
    //     accountId: 'valid_account_id',
    //     userId: 'valid_user_id',
    //     name: 'valid_name',
    //   });
    //   expect(extenssionNew).toHaveProperty('id');
    // });
    //
    //
    //FIXME: broken test
    // it('should not be able create new extension without role owner', async () => {
    //   const userRole = {
    //     role: '',
    //   };
    //   const extension = {
    //     id: 'valid_id',
    //     name: 'valid_name',
    //   } as Extension;
    //   mockRepositoryUserRole.findOne.mockReturnValue(userRole);
    //   mockRepositoryExtensionModules.create.mockReturnValue(extension);
    //   mockRepositoryExtensionModules.save.mockReturnValue(extension);
    //   await expect(
    //     service.create({
    //       accountId: 'valid_account_id',
    //       userId: 'valid_user_id',
    //       name: 'valid_name',
    //     }),
    //   ).rejects.toEqual(Error('Access denied'));
    // });
  });

  it('should be able retrieve all extensions', async () => {
    mockRepositoryExtensionModules
      .createQueryBuilder()
      .getRawMany.mockReturnValue([{ id: 'wwwwww' }]);

    const extensions = await service.findAll();

    expect(extensions).toHaveProperty('id');
  });
});
