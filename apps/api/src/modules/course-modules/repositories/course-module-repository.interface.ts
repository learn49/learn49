import { CourseModule } from '../course-modules.entity';

export interface CreateCourseModuleArgs {
  accountId: string;
  courseVersionId: string;
  title: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindOneCourseModuleByIdAndAccountIdArgs {
  id: string;
  accountId: string;
}

interface SortOrder {
  direction: 'GT' | 'LT';
  value: number;
}

export interface FindOneCourseModuleArgs {
  id?: string;
  accountId: string;
  courseVersionId?: string;
  sortOrder?: number | SortOrder;
  isActive?: boolean;
  order?: {
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface FindAllCourseModuleArgs {
  accountId: string;
  courseVersionId: string;
  limit?: number;
  offset?: number;
  isActive?: boolean;
  order?: {
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface CountCourseModuleArgs {
  accountId: string;
  courseVersionId: string;
}

export interface ICourseModuleRepository {
  create(args: CreateCourseModuleArgs): Promise<CourseModule>;
  findOne(args: FindOneCourseModuleArgs): Promise<CourseModule | undefined>;
  findAll(args: FindAllCourseModuleArgs): Promise<CourseModule[]>;
  count(args: CountCourseModuleArgs): Promise<number>;
  save(args: CourseModule): Promise<CourseModule>;
  remove(args: CourseModule): Promise<void>;
}
