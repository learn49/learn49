import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModuleService } from '../course-modules.service';
import { UserRole } from '../../users/user-role.entity';
import { CourseLesson } from '../../course-lessons/course-lessons.entity';
import { Enrollment } from '../../enrollment/enrollment.entity';
import { CourseModule } from '../course-modules.entity';
import { CustomLastCourseAccessRepository } from '../../last-course-access/last-course-access.repository';
import { LastCourseAccess } from '../../last-course-access/last-course-access.entity';
import { ICourseModuleRepository } from '../repositories/course-module-repository.interface';

describe('CourseModuleService', () => {
  let service: CourseModuleService;
  let courseModuleRepository: ICourseModuleRepository;
  let userRoleRepository: Repository<UserRole>;
  let ormRepository: Repository<LastCourseAccess>;
  let courseLessonRepository: Repository<CourseLesson>;
  let enrollmentRepository: Repository<Enrollment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseModuleService,
        {
          provide: 'COURSE_MODULE_REPOSITORY',
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: 'LAST_COURSE_ACCESS_REPOSITORY',
          useClass: CustomLastCourseAccessRepository,
        },
        {
          provide: getRepositoryToken(LastCourseAccess),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CourseModule),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CourseLesson),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<CourseModuleService>(CourseModuleService);
    courseModuleRepository = module.get<ICourseModuleRepository>(
      'COURSE_MODULE_REPOSITORY',
    );
    userRoleRepository = module.get<Repository<UserRole>>(
      getRepositoryToken(UserRole),
    );
    ormRepository = module.get<Repository<LastCourseAccess>>(
      getRepositoryToken(LastCourseAccess),
    );
    courseLessonRepository = module.get<Repository<CourseLesson>>(
      getRepositoryToken(CourseLesson),
    );
    enrollmentRepository = module.get<Repository<Enrollment>>(
      getRepositoryToken(Enrollment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(courseModuleRepository).toBeDefined();
    expect(userRoleRepository).toBeDefined();
    expect(ormRepository).toBeDefined();
    expect(courseLessonRepository).toBeDefined();
    expect(enrollmentRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('Should be return courseModule data without userId', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        limit: 10,
        offset: 1,
      };
      const mockUser: UserRole = {
        id: '9d8aa8ac-c09b-4638-ba2f-77af7fdfddb1',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        userId: 'c425fa10-c669-4a34-bbe0-bfd658b4e274',
        role: 'owner',
        createdAt: new Date('2021-01-25T21:40:06.836Z'),
        updatedAt: new Date('2021-01-25T21:40:06.836Z'),
        generateGuid: null,
      };
      const mockCouseModule: CourseModule = {
        id: '080ade9f-7658-4717-a329-95177caef3bc',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        courseVersionId: '8070819c-9895-4382-8144-6fe19b570cda',
        title: 'Aulão',
        baseModuleId: null,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2021-10-27T01:03:04.874Z'),
        updatedAt: new Date('2021-10-27T01:04:32.946Z'),
        metadata: null,
        generateGuid: null,
      };
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(courseModuleRepository, 'findAll')
        .mockResolvedValueOnce([mockCouseModule]);
      jest.spyOn(courseModuleRepository, 'count').mockResolvedValueOnce(8);
      const result = await service.findAll(input);
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(0);
      expect(courseModuleRepository.findAll).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.count).toHaveBeenCalledTimes(1);
      expect(typeof result).toEqual('object');
    });

    it('Should be return courseModule data with userId', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        userId: 'some-valid-id',
        limit: 10,
        offset: 1,
      };
      const mockUser: UserRole = {
        id: '9d8aa8ac-c09b-4638-ba2f-77af7fdfddb1',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        userId: 'c425fa10-c669-4a34-bbe0-bfd658b4e274',
        role: 'owner',
        createdAt: new Date('2021-01-25T21:40:06.836Z'),
        updatedAt: new Date('2021-01-25T21:40:06.836Z'),
        generateGuid: null,
      };
      const mockCouseModule: CourseModule = {
        id: '080ade9f-7658-4717-a329-95177caef3bc',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        courseVersionId: '8070819c-9895-4382-8144-6fe19b570cda',
        title: 'Aulão',
        baseModuleId: null,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2021-10-27T01:03:04.874Z'),
        updatedAt: new Date('2021-10-27T01:04:32.946Z'),
        metadata: null,
        generateGuid: null,
      };
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(courseModuleRepository, 'findAll')
        .mockResolvedValueOnce([mockCouseModule]);
      jest.spyOn(courseModuleRepository, 'count').mockResolvedValueOnce(8);
      const result = await service.findAll(input);
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.findAll).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.count).toHaveBeenCalledTimes(1);
      expect(typeof result).toEqual('object');
    });
  });

  describe('findOne', () => {
    it('Should throw error if userId not found', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        courseModuleId: 'some-valid-id',
        userId: 'inexistent-id',
      };
      jest
        .spyOn(userRoleRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      await expect(service.findOne(input)).rejects.toThrow('User not found');
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.findOne).toHaveBeenCalledTimes(0);
    });

    it('Should throw error if userRole.role is null', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        courseModuleId: 'some-valid-id',
        userId: 'inexistent-id',
      };
      const mockUser: UserRole = {
        id: '9d8aa8ac-c09b-4638-ba2f-77af7fdfddb1',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        userId: 'c425fa10-c669-4a34-bbe0-bfd658b4e274',
        role: null,
        createdAt: new Date('2021-01-25T21:40:06.836Z'),
        updatedAt: new Date('2021-01-25T21:40:06.836Z'),
        generateGuid: null,
      };
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValueOnce(mockUser);
      await expect(service.findOne(input)).rejects.toThrow(
        'Course module not found',
      );
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should throw error if Course Module not found', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        courseModuleId: 'invalid-id',
        userId: 'existent-id',
      };
      const mockUser: UserRole = {
        id: '9d8aa8ac-c09b-4638-ba2f-77af7fdfddb1',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        userId: 'c425fa10-c669-4a34-bbe0-bfd658b4e274',
        role: 'owner',
        createdAt: new Date('2021-01-25T21:40:06.836Z'),
        updatedAt: new Date('2021-01-25T21:40:06.836Z'),
        generateGuid: null,
      };
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(courseModuleRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      await expect(service.findOne(input)).rejects.toThrow(
        'Course module not found',
      );
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should be return courseModule data', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        courseModuleId: 'some-valid-id',
        userId: 'existent-id',
      };
      const mockUser: UserRole = {
        id: '9d8aa8ac-c09b-4638-ba2f-77af7fdfddb1',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        userId: 'c425fa10-c669-4a34-bbe0-bfd658b4e274',
        role: 'owner',
        createdAt: new Date('2021-01-25T21:40:06.836Z'),
        updatedAt: new Date('2021-01-25T21:40:06.836Z'),
        generateGuid: null,
      };
      const mockCouseModule: CourseModule = {
        id: '002a800e-e21f-42c4-9083-491751405617',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        courseVersionId: 'bfdfa182-431f-4ff2-94e0-1e33bfe96b7a',
        title: 'Projeto: PalpiteBox',
        baseModuleId: null,
        sortOrder: 6,
        isActive: true,
        createdAt: new Date('2022-07-31T06:01:37.777Z'),
        updatedAt: new Date('2022-07-31T06:01:55.727Z'),
        metadata: null,
        generateGuid: null,
      };
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(courseModuleRepository, 'findOne')
        .mockResolvedValueOnce(mockCouseModule);
      const result = await service.findOne(input);
      expect(typeof result).toEqual('object');
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findLessonsByModuleId', () => {
    it('Should be return courseModule data without userId', async () => {
      const input = {
        accountId: 'some-valid-account',
        courseVersionId: 'some-valid-id',
        limit: 10,
        offset: 1,
      };
      const mockUser: UserRole = {
        id: '9d8aa8ac-c09b-4638-ba2f-77af7fdfddb1',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        userId: 'c425fa10-c669-4a34-bbe0-bfd658b4e274',
        role: 'owner',
        createdAt: new Date('2021-01-25T21:40:06.836Z'),
        updatedAt: new Date('2021-01-25T21:40:06.836Z'),
        generateGuid: null,
      };
      const mockCouseModule: CourseModule = {
        id: '080ade9f-7658-4717-a329-95177caef3bc',
        accountId: '3566f823-5993-47f3-88a1-38669ea07944',
        courseVersionId: '8070819c-9895-4382-8144-6fe19b570cda',
        title: 'Aulão',
        baseModuleId: null,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2021-10-27T01:03:04.874Z'),
        updatedAt: new Date('2021-10-27T01:04:32.946Z'),
        metadata: null,
        generateGuid: null,
      };
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(courseModuleRepository, 'findAll')
        .mockResolvedValueOnce([mockCouseModule]);
      jest.spyOn(courseModuleRepository, 'count').mockResolvedValueOnce(8);
      const result = await service.findAll(input);
      expect(userRoleRepository.findOne).toHaveBeenCalledTimes(0);
      expect(courseModuleRepository.findAll).toHaveBeenCalledTimes(1);
      expect(courseModuleRepository.count).toHaveBeenCalledTimes(1);
      expect(typeof result).toEqual('object');
    });
  });
});
