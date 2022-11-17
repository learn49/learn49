import './bootstrap';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSubModule } from './modules/pubSub/pubSub.module';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { AccountModule } from './modules/accounts/account.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { NotificationModule } from './modules/notifications/notifications.module';
import { TagModule } from './modules/tags/tag.module';
import { ExtensionsModule } from './modules/extensions/extensions.module';
import { LastCourseAccessModule } from './modules/last-course-access/last-course-access.module';
import { ExtensionInstallationModule } from './modules/extension-installations/extension-installations.module';
import { OffersModule } from './modules/offers/offers.module';
import { MainCourseModule } from './modules/courses/courses.module';
import { ThreadModule } from './modules/thread/thread.module';
import { HomeModule } from './modules/home/home.module';
import { ThreadAnswerModule } from './modules/thread-answers/thread-answers.module';
import { CourseModulesModule } from './modules/course-modules/course-modules.module';
import { CourseVersionModule } from './modules/course-versions/course-versions.module';
import { CourseLessonModule } from './modules/course-lessons/course-lessons.module';
import { UserModule } from './modules/users/user.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { Upload } from './scalars/upload.scalar';
import { verify } from './auth/auth';
import dbConfig from './config/database';
import sendGridConfig from './config/sendgrid';
import { LabelModule } from './modules/labels/label.module';
import { MediaFileModule } from './modules/media-file/media-file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      username: dbConfig.user,
      password: dbConfig.pass,
      database: dbConfig.db,
      port: Number(dbConfig.port),
      logging: false,
      autoLoadEntities: true,
      /*ssl: dbConfig.ssl,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },*/
    }),
    SendGridModule.forRoot({ apikey: sendGridConfig.apiKey }),
    ExtensionsModule,
    PubSubModule,
    ExtensionInstallationModule,
    OffersModule,
    AccountModule,
    MainCourseModule,
    EnrollmentModule,
    CourseVersionModule,
    TagModule,
    CourseModulesModule,
    CourseLessonModule,
    ThreadModule,
    ThreadAnswerModule,
    LastCourseAccessModule,
    HomeModule,
    UserModule,
    WebhookModule,
    NotificationModule,
    LabelModule,
    MediaFileModule,
    Upload,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: process.env.NODE_ENV !== 'production',
      introspection: true,
      context: ({ req, connection }) => {
        if (connection) {
          return connection.context;
        } else {
          const token = req.headers.authorization || '';
          if (token) {
            try {
              const cleanToken = token.split(' ')[1];
              const user = verify(cleanToken);
              return {
                user,
              };
            } catch (err) {
              // throw new Error(err);
            }
          }
        }
        // return {};
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
