import { Injectable, Inject } from '@nestjs/common';
import { generateHash } from '../../auth/auth';
import { SendgridService } from '../../services/sendgrid.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../users/user-role.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Token } from '@/modules/tokens/token.entity';

import { v4 as uuid } from 'uuid';
import { AppExceptions } from '@/utils/AppExceptions';
import { IEnrollmentRepository } from './enrollment.interface';
import { ICourseRepository } from '../courses/repositories/course-repository.interface';
import { CreateEnrollmentArgs, FindAllEnrollmentsArgs } from './types';

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject('ENROLLMENT_REPOSITORY')
    private readonly enrollmentRepository: IEnrollmentRepository,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepository: ICourseRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
    @Inject(SendgridService)
    private readonly sendGrid: SendgridService,
  ) { }

  async create({
    accountId,
    userId,
    studentId,
    courseId,
    courseVersionId,
    startDate,
    endDate,
    type,
  }: CreateEnrollmentArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const isEnrolled = await this.enrollmentRepository.findOneBy({
      userId: studentId,
      accountId: accountId,
      courseId: courseId,
    });

    if (isEnrolled) {
      throw AppExceptions.StudentIsAlreadyEnrolled;
    }

    const enrollment = await this.enrollmentRepository.create({
      accountId,
      userId: studentId,
      courseId,
      courseVersionId,
      startDate,
      endDate,
      status: 'active',
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await this.userRepository.findOne({
      id: studentId,
      accountId: accountId,
    });

    if (!user) {
      throw AppExceptions.StudentNotFound;
    }

    const course = await this.courseRepository.findOne({
      id: courseId,
      accountId,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const createdToken = uuid();

    const token = this.tokensRepository.create({
      accountId,
      userId: studentId,
      token: generateHash(createdToken),
      scope: 'create_password',
      expiresIn: expires,
    });

    const mainEmail = user.emails.find(email => email.main);

    const sendGridParams = {
      name: `${user.firstName} ${user.lastName}`,
      course: course.title,
      email: mainEmail.email,
      activatedCode: `${token.id}/${createdToken}`,
    };

    await this.tokensRepository.save(token);

    await this.sendGrid.userEnrollment(sendGridParams);

    return enrollment;
  }

  async findAll({ userId, accountId, courseId }: FindAllEnrollmentsArgs) {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        userId,
        accountId,
      },
    });

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const enrollments = await this.enrollmentRepository.find({
      accountId,
      courseId,
    });

    const parsedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      accountId: enrollment.accountId,
      courseVersionId: enrollment.courseVersionId,
      student:
        enrollment.firstName && enrollment.lastName
          ? `${enrollment.firstName} ${enrollment.lastName}`
          : '-',
      course: enrollment.title,
      courseVersionName: enrollment.courseVersionId,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      enrollmentDate: enrollment.createdAt,
      type: enrollment.type,
      status: enrollment.status,
    }));

    return parsedEnrollments;
  }
}
