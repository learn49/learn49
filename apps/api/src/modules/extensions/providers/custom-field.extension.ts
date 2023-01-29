import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ICourseRepository } from '@/modules/courses/repositories/course-repository.interface';
import { CourseLesson } from '@/modules/course-lessons/course-lessons.entity';
import { ICourseModuleRepository } from '@/modules/course-modules/repositories/course-module-repository.interface';
import { IUserRepository } from '@/modules/users/repositories/user-repository.interface';
import { IExtensionInstallation } from '@/modules/extension-installations/extension-installations.interface';
import { AppExceptions } from '@/utils/AppExceptions';
import { IExtensionsRepository } from '../extensions.interface';
import { Entity } from '../dto/WriteCustomFieldInput';
import { IMediaFileRepository } from '@/modules/media-file/repositories/media-file.interface';
import { ExtensionInstallation } from '@/modules/extension-installations/extension-installations.entity';
import { Course } from '@/modules/courses/courses.entity';
import { CourseModule } from '@/modules/course-modules/course-modules.entity';
import { User } from '@/modules/users/user.entity';

interface ReadCustomFields {
  accountId: string;
  installationId: string;
  extensionSlug: string;
  entity: Entity;
  entityId: string;
  field: string;
}

interface WriteCustomFields {
  accountId: string;
  extensionId: string;
  entity: Entity;
  entityId: string;
  fields: {
    [key: string]: string | number | boolean;
  }; //Checar type
}

type FieldType = 'media' | 'string' | 'number' | 'boolean';

interface SettingsOption {
  type: FieldType;
  label: string;
  required: boolean;
}

type Settings = Record<string, SettingsOption>;

interface ValidateFieldsArgs {
  fields: any;
  settings: Settings;
}

interface AddFieldsToMetadataArgs {
  entity: Course | CourseLesson | CourseModule | User;
  fields: any;
  installationId: string;
}

@Injectable()
export class CustomFieldExtension {
  constructor(
    @Inject('EXTENSION_INSTALLATION_REPOSITORY')
    private readonly extensionInstallationRepository: IExtensionInstallation,
    @Inject('EXTENSION_REPOSITORY')
    private readonly extensionRepository: IExtensionsRepository,
    @Inject('COURSE_REPOSITORY')
    private readonly courseRepository: ICourseRepository,
    @InjectRepository(CourseLesson)
    private readonly courseLessonRepository: Repository<CourseLesson>,
    @Inject('COURSE_MODULE_REPOSITORY')
    private readonly courseModuleRepository: ICourseModuleRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    @Inject('MEDIA_FILE_REPOSITORY')
    private readonly mediaFileRepository: IMediaFileRepository,
  ) {}

  async read({
    accountId,
    installationId,
    extensionSlug,
    entity,
    entityId,
    field,
  }: ReadCustomFields) {
    let getEntity = null;

    if (entity === 'courses') {
      getEntity = await this.courseRepository.findOne({
        id: entityId,
        accountId,
      });
    }

    if (entity === 'course_modules') {
      getEntity = await this.courseModuleRepository.findOne({
        id: entityId,
        accountId,
      });
    }

    if (entity === 'course_lessons') {
      getEntity = await this.courseLessonRepository.findOne({
        id: entityId,
        accountId,
      });
    }

    if (entity === 'users') {
      getEntity = await this.userRepository.findOneByAccountIdAndUserId({
        userId: entityId,
        accountId,
      });
    }

    if (getEntity) {
      const customFields = getEntity.metadata[extensionSlug];

      if (customFields) {
        const customField = installationId
          ? customFields.find(field => field.installationId === installationId)
          : customFields?.[0];

        if (customField && customField.fields[field]) {
          return customField.fields[field];
        }
      }
    }

    return null;
  }

  async write({
    accountId,
    extensionId,
    entity,
    entityId,
    fields,
  }: WriteCustomFields) {
    const [extension] = await this.extensionRepository.findAll({
      id: extensionId,
    });

    if (!extension) {
      throw new Error('Extension not found');
    }

    const extensionInstallation = (await this.extensionInstallationRepository.findOne(
      {
        accountId,
        extensionId,
      },
    )) as ExtensionInstallation;

    if (!extensionInstallation) {
      throw AppExceptions.ExtensionNotInstalled;
    }

    const isValidEntity = extension.scopes.includes(entity);

    if (!isValidEntity) {
      throw new Error('Entity is not valid');
    }

    const { hasInvalidFields, error } = await this.validateFields({
      fields,
      settings: extensionInstallation.settingsValues,
    });

    if (hasInvalidFields) {
      throw new Error(error);
    }

    if (entity === 'courses') {
      const course = await this.courseRepository.findOne({
        id: entityId,
        accountId,
      });

      if (!course) {
        throw AppExceptions.CourseNotFound;
      }

      const courseWithMetadata = this.addFieldsToMetadata({
        entity: course,
        fields,
        installationId: extensionInstallation.id,
      });

      await this.courseRepository.save(courseWithMetadata as Course);
    }

    if (entity === 'course_modules') {
      const courseModule = await this.courseModuleRepository.findOne({
        id: entityId,
        accountId,
      });

      if (!courseModule) {
        throw AppExceptions.CourseModuleNotFound;
      }

      const courseModuleWithMetadata = this.addFieldsToMetadata({
        entity: courseModule,
        fields,
        installationId: extensionInstallation.id,
      });

      await this.courseModuleRepository.save(
        courseModuleWithMetadata as CourseModule,
      );
    }

    if (entity === 'course_lessons') {
      const courseLesson = await this.courseLessonRepository.findOne({
        id: entityId,
        accountId,
      });

      if (!courseLesson) {
        throw AppExceptions.CourseLessonNotFound;
      }

      const courseLessonWithMetadata = this.addFieldsToMetadata({
        entity: courseLesson,
        fields,
        installationId: extensionInstallation.id,
      });

      await this.courseLessonRepository.save(
        courseLessonWithMetadata as CourseLesson,
      );
    }

    if (entity === 'users') {
      const user = await this.userRepository.findOneByAccountIdAndUserId({
        userId: entityId,
        accountId,
      });

      if (!user) {
        throw AppExceptions.CourseNotFound;
      }

      const userWithMetadata = this.addFieldsToMetadata({
        entity: user,
        fields,
        installationId: extensionInstallation.id,
      });

      await this.userRepository.save(userWithMetadata as User);
    }

    return fields;
  }

  private addFieldsToMetadata({
    entity,
    fields,
    installationId,
  }: AddFieldsToMetadataArgs): Course | CourseLesson | CourseModule | User {
    if (!entity.metadata) {
      const metadata = {
        ['custom-field']: [
          {
            installationId,
            fields,
          },
        ],
      };

      entity.metadata = metadata;
    } else {
      const metadataIndex = entity.metadata['custom-field'].findIndex(
        eachMetadata => eachMetadata.installationId === installationId,
      );

      if (metadataIndex === -1) {
        const metadata = {
          installationId: installationId,
          fields,
        };

        entity.metadata['custom-field'].push(metadata);
      } else {
        entity.metadata['custom-field'][metadataIndex].fields = fields;
      }
    }

    return entity;
  }

  private async validateFields({ fields, settings }: ValidateFieldsArgs) {
    const errors = [];

    const validatePromise = Object.keys(fields).map(async fieldName => {
      const fieldExists = settings[fieldName];

      if (!fieldExists) {
        errors.push(`${fieldName} is invalid field`);
      }

      const fieldValue = fields[fieldName];

      if (fieldExists && typeof fieldValue !== fieldExists.type) {
        errors.push(`${fieldName} field is not in correct type`);
      }

      if (fieldExists && fieldExists.type === 'media') {
        try {
          const media = await this.mediaFileRepository.findOne({
            id: fieldValue,
          });

          if (!media) {
            errors.push(`${fieldName} is invalid field`);
          }
        } catch (error) {
          errors.push(`${fieldName} is invalid field`);
        }
      }
    });

    await Promise.all(validatePromise);

    const errorMessage = this.formatFieldsValidateErrorMessage(errors);

    return {
      hasInvalidFields: errors.length > 0,
      error: errorMessage,
    };
  }

  private formatFieldsValidateErrorMessage(errors: string[]) {
    return `Invalid fields: ${errors.join(', ')}`;
  }
}
