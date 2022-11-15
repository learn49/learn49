import { HttpException, HttpStatus } from '@nestjs/common';

type AppExceptionType =
  | 'AccountNotFound'
  | 'AccessDenied'
  | 'CourseModuleNotFound'
  | 'SubdomainAlreadyExists'
  | 'ThreadNotFound'
  | 'LessonNotFound'
  | 'EnrollmentNotFound'
  | 'EnrollmentNotStarted'
  | 'EnrollmentExpired'
  | 'LessonProgressNotFound'
  | 'LessonNotAvailable'
  | 'StudentNotFound'
  | 'StudentIsAlreadyEnrolled'
  | 'NotificationNotFound'
  | 'EmailNotFound'
  | 'EmailIsAlreadyInUse'
  | 'TokenHasAlreadyBeenUsed'
  | 'InvalidToken'
  | 'PasswordConfirmationIsNotCorrect'
  | 'TokenHasAlreadyExpired'
  | 'UserNotFound'
  | 'PasswordNotMatch'
  | 'InvalidPassword'
  | 'OnlyOwnerCanCreateCourses'
  | 'CourseNotFound'
  | 'InvalidCaptcha'
  | 'LabelNotFound'
  | 'ExtensionNotInstalled'
  | 'ExtensionDisabled'
  | 'CourseVersionNotFound'
  | 'UserRoleNotFound'
  | 'MediaFileNotFound'
  | 'CourseLessonNotFound';

export class AppException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

export const AppExceptions: Record<AppExceptionType, AppException> = {
  AccountNotFound: new AppException('Account not found'),
  ThreadNotFound: new AppException('Thread not found'),
  AccessDenied: new AppException('Access denied', HttpStatus.FORBIDDEN),
  CourseModuleNotFound: new AppException('Course module not found'),
  SubdomainAlreadyExists: new AppException('Subdomain already exists'),
  LessonNotFound: new AppException('Lesson not found'),
  EnrollmentNotFound: new AppException('Enrollment not found'),
  EnrollmentNotStarted: new AppException('Enrollment not started'),
  EnrollmentExpired: new AppException('Enrollment expired'),
  LessonProgressNotFound: new AppException('Lesson progress not found'),
  LessonNotAvailable: new AppException('Lesson not available'),
  StudentNotFound: new AppException('Student not found'),
  StudentIsAlreadyEnrolled: new AppException('Student is already enrolled'),
  NotificationNotFound: new AppException('Notification not found'),
  EmailNotFound: new AppException('Email not found'),
  EmailIsAlreadyInUse: new AppException('Email is already in use'),
  TokenHasAlreadyBeenUsed: new AppException('Token has already been used'),
  InvalidToken: new AppException('Invalid token'),
  PasswordConfirmationIsNotCorrect: new AppException(
    'Password confirmation is not correct',
  ),
  TokenHasAlreadyExpired: new AppException('Token has already expired'),
  UserNotFound: new AppException('User not found'),
  PasswordNotMatch: new AppException('Passwords not match'),
  InvalidPassword: new AppException('Invalid password!'),
  OnlyOwnerCanCreateCourses: new AppException('Only owner can create courses'),
  CourseNotFound: new AppException('Course not found'),
  InvalidCaptcha: new AppException('Invalid captcha'),
  LabelNotFound: new AppException('Label not found'),
  ExtensionNotInstalled: new AppException('Extension not installed'),
  ExtensionDisabled: new AppException('Extension disabled'),
  CourseVersionNotFound: new AppException('Course version not found'),
  UserRoleNotFound: new AppException('User role not found'),
  MediaFileNotFound: new AppException('Media file not found'),
  CourseLessonNotFound: new AppException('Course lesson not found'),
};
