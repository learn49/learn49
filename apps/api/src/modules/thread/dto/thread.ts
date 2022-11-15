import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { ThreadAnswers } from '@/modules/thread-answers/dto/thread-answers';
import { User } from '@/modules/users/dto/user';
import { Lesson } from '@/modules/course-lessons/dto/course-lesson.public';
import { Course } from '@/modules/courses/dto/course';

@ObjectType()
export class Thread {
  @Field(() => ID) id: string;
  @Field(() => ID) accountId: string;
  @Field() author: string;
  @Field(() => User) user: User;
  @Field(() => [ThreadAnswers]) answers: [ThreadAnswers];
  @Field(() => ID, { nullable: true }) courseId: string;
  @Field(() => ID, { nullable: true }) lessonId: string;
  @Field(() => ID, { nullable: true }) moduleId: string;
  @Field() title: string;
  @Field() body: string;
  @Field({ nullable: true }) tags: string;
  @Field() isSolved: boolean;
  @Field() isTicket: boolean;
  @Field() isPinned: boolean;
  @Field() isClosed: boolean;
  lesson: Lesson;
  @Field(() => Course, { nullable: true }) course: Course;
  @Field({ nullable: true }) courseVersionId: string;
  @Field() createdAt: Date;
}

@ObjectType()
export class AllThreads {
  @Field(() => [Thread]) discussions: [Thread];
  @Field(() => Int) totalDiscussion: number;
  @Field(() => Int) totalOpen: number;
  @Field(() => Int) totalClose: number;
}
