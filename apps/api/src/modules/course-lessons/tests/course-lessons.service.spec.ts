import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../users/user-role.entity';
import { CourseLesson } from '../../course-lessons/course-lessons.entity';
import { Enrollment } from '../../enrollment/enrollment.entity';
import { LastCourseAccess } from '../../last-course-access/last-course-access.entity';
import { CourseLessonService } from '../course-lessons.service';
import { LessonProgress } from '../lesson-progress.entity';
import { ICourseModuleRepository } from '../../course-modules/repositories/course-module-repository.interface';

describe('CourseLessonService', () => {
  let service: CourseLessonService;
  let courseLessonRepository: Repository<CourseLesson>;
  let courseModuleRepository: ICourseModuleRepository;
  let userRoleRepository: Repository<UserRole>;
  let lastCourseAccessRepository: Repository<LastCourseAccess>;
  let lessonProgressRepository: Repository<LessonProgress>;
  let enrollmentRepository: Repository<Enrollment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseLessonService,
        {
          provide: 'COURSE_MODULE_REPOSITORY',
          useValue: {},
        },
        {
          provide: getRepositoryToken(LastCourseAccess),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LessonProgress),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {},
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
    service = module.get<CourseLessonService>(CourseLessonService);
    courseLessonRepository = module.get<Repository<CourseLesson>>(
      getRepositoryToken(CourseLesson),
    );
    courseModuleRepository = module.get<ICourseModuleRepository>(
      'COURSE_MODULE_REPOSITORY',
    );
    userRoleRepository = module.get<Repository<UserRole>>(
      getRepositoryToken(UserRole),
    );
    lastCourseAccessRepository = module.get<Repository<LastCourseAccess>>(
      getRepositoryToken(LastCourseAccess),
    );
    courseLessonRepository = module.get<Repository<CourseLesson>>(
      getRepositoryToken(CourseLesson),
    );
    lessonProgressRepository = module.get<Repository<LessonProgress>>(
      getRepositoryToken(LessonProgress),
    );
    enrollmentRepository = module.get<Repository<Enrollment>>(
      getRepositoryToken(Enrollment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(courseModuleRepository).toBeDefined();
    expect(userRoleRepository).toBeDefined();
    expect(lastCourseAccessRepository).toBeDefined();
    expect(lessonProgressRepository).toBeDefined();
    expect(courseLessonRepository).toBeDefined();
    expect(enrollmentRepository).toBeDefined();
  });

  describe('completed', () => {
    it('should return false when userId is inexistent', async () => {
      const input = {
        lessonId: 'valid-id',
        accountId: 'some-valid-account',
      };
      const result = await service.completed(input);
      expect(result).toBeFalsy();
      expect(lessonProgressRepository.findOne).toHaveBeenCalledTimes(0);
    });

    it('should return false when lessonProgress is inexistent', async () => {
      const input = {
        lessonId: 'valid-id',
        accountId: 'some-valid-account',
        userId: 'some-valid-id',
      };
      jest
        .spyOn(lessonProgressRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      const result = await service.completed(input);
      expect(result).toBeFalsy();
      expect(lessonProgressRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return false when lessonProgress.completed is false', async () => {
      const input = {
        lessonId: 'valid-id',
        accountId: 'some-valid-account',
        userId: 'some-valid-id',
      };
      const mockLessonProgress: LessonProgress = {
        ...input,
        id: '1bec4762-4648-409d-adb0-04157a19d6e6',
        courseId: '78de96e5-1146-41d7-a462-a2097fe26bee',
        courseVersionId: '8bc118b0-a124-4d83-b26f-9582fa6c7c88',
        completed: false,
        startedAt: new Date('2021-08-07T00:41:37.814Z'),
        completedAt: null,
        createdAt: new Date('2021-08-07T00:41:37.814Z'),
        updatedAt: new Date('2021-08-07T00:41:37.814Z'),
        generateId: null,
      };
      jest
        .spyOn(lessonProgressRepository, 'findOne')
        .mockResolvedValueOnce(mockLessonProgress);
      const result = await service.completed(input);
      expect(result).toBeFalsy();
      expect(lessonProgressRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return true when lessonProgress.completed is true', async () => {
      const input = {
        lessonId: 'valid-id',
        accountId: 'some-valid-account',
        userId: 'some-valid-id',
      };
      const mockLessonProgress: LessonProgress = {
        ...input,
        id: '1bec4762-4648-409d-adb0-04157a19d6e6',
        courseId: '78de96e5-1146-41d7-a462-a2097fe26bee',
        courseVersionId: '8bc118b0-a124-4d83-b26f-9582fa6c7c88',
        completed: true,
        startedAt: new Date('2021-08-07T00:41:37.814Z'),
        completedAt: null,
        createdAt: new Date('2021-08-07T00:41:37.814Z'),
        updatedAt: new Date('2021-08-07T00:41:37.814Z'),
        generateId: null,
      };
      jest
        .spyOn(lessonProgressRepository, 'findOne')
        .mockResolvedValueOnce(mockLessonProgress);
      const result = await service.completed(input);
      expect(result).toBeTruthy();
      expect(lessonProgressRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
