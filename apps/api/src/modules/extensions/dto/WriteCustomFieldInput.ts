import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import graphqlTypeJson from 'graphql-type-json';

export enum Entity {
  courses = 'courses',
  course_modules = 'course_modules',
  course_lessons = 'course_lessons',
  users = 'users',
}

registerEnumType(Entity, {
  name: 'Entity',
});

@InputType()
export class WriteCustomFieldsInput {
  @Field()
  extensionId: string;

  @Field(() => Entity)
  entity: Entity;

  @Field()
  entityId: string;

  @Field(() => graphqlTypeJson)
  fields: any;
}
