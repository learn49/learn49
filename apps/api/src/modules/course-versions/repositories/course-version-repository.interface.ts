import { CourseVersion } from '../course-versions.entity';
import {
  CreatCourseVersionArgs,
  FindAllCourseVersionArgs,
  FindOneCourseVersionArgs,
} from '../interfaces';

export interface ICourseVersionRepository {
  create(args: CreatCourseVersionArgs): Promise<CourseVersion>;
  findAll(args: FindAllCourseVersionArgs): Promise<CourseVersion[]>;
  findOne(args: FindOneCourseVersionArgs): Promise<CourseVersion | undefined>;
  count(accountId: string): Promise<number>;
  save(args: CourseVersion): Promise<CourseVersion>;
  remove(args: CourseVersion): Promise<void>;
}
