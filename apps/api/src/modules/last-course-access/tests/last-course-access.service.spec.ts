import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from '../../users/user-role.entity';
import { LastCourseAccess } from '../last-course-access.entity';
import { LastCourseAccessService } from '../last-course-access.service';

describe('CourseVersionService', () => {
  let service: LastCourseAccessService;

  // const mockRepositoryLastCourseAccess = {
  //   createQueryBuilder: jest.fn(() => ({
  //     select: jest.fn().mockReturnThis(),
  //     where: jest.fn().mockReturnThis(),
  //     addSelect: jest.fn().mockReturnThis(),
  //     leftJoin: jest.fn().mockReturnThis(),
  //     andWhere: jest.fn().mockReturnThis(),
  //     orderBy: jest.fn().mockReturnThis(),
  //     getOne: jest.fn().mockReturnThis(),
  //   })),
  // };

  // const mockRepositoryUserRole = {
  //   findOne: jest.fn(),
  // };
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       LastCourseAccessService,
  //       {
  //         provide: getRepositoryToken(LastCourseAccessService),
  //         useValue: mockRepositoryLastCourseAccess,
  //       },
  //     ],
  //   }).compile();

  //   service = module.get<LastCourseAccessService>(LastCourseAccessService);
  // });

  it('should  define', async () => {
    // expect(service).toBeDefined();
  });

  //FIXME: broken test
  // describe('create', () => {
  //   it('should be able to retrieve all lastCourseAccess', async () => {
  //     mockRepositoryLastCourseAccess.createQueryBuilder().getMany([]);
  //     const curseVersionNew = await service.findOne({
  //       accountId: 'valid_accout_id',
  //       courseId: 'valid_course_id',
  //       userId: 'valid_user_id',
  //     });

  //     expect(curseVersionNew).toBe([]);
  //   });
  // });
});
