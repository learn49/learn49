import { AppExceptions } from '@/utils/AppExceptions';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModule } from '../course-modules/course-modules.entity';
import { UserRole } from '../users/user-role.entity';
import { ICourseVersionRepository } from './repositories/course-version-repository.interface';
import { CreateCourseVersionArgs, FindAllArgs } from './types';

@Injectable()
export class CourseVersionService {
  constructor(
    @Inject('COURSE_VERSION_REPOSITORY')
    private readonly courseVersionRepository: ICourseVersionRepository,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(CourseModule)
    private readonly courseModulesRepository: Repository<CourseModule>,
  ) { }
  async create({
    accountId,
    userId,
    courseId,
    courseVersionId,
    versionName,
    description,
    allowBuy,
  }: CreateCourseVersionArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.OnlyOwnerCanCreateCourses;
    }

    const modules = await this.courseModulesRepository.find({
      where: { courseVersionId },
    });

    const courseVersion = await this.courseVersionRepository.create({
      accountId,
      courseId,
      name: versionName,
      description,
      allowBuy: allowBuy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newModules = modules.map(module =>
      this.courseModulesRepository.create({
        title: module.title,
        accountId: accountId,
        courseVersionId: courseVersion.id,
        baseModuleId: module.baseModuleId ? module.baseModuleId : module.id,
        sortOrder: module.sortOrder,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await this.courseModulesRepository.save(newModules);

    return courseVersion;
  }

  async findAll({ accountId, courseId, limit, offset }: FindAllArgs) {
    const courseVersions = await this.courseVersionRepository.findAll({
      courseId,
      accountId,
      limit,
      offset,
    });

    const totalCount = await this.courseVersionRepository.count(accountId);

    return { versions: courseVersions, totalCount: totalCount };
  }
}
