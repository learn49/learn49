import { MigrationInterface, QueryRunner } from 'typeorm';

export class v01647902349015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`
      CREATE TABLE accounts (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        friendly_name VARCHAR(255),
        subdomain VARCHAR(255),
        domains jsonb,
        description TEXT,
        recaptcha_site_key VARCHAR(255),
        recaptcha_secret VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        identifiers jsonb,
        profile_picture TEXT,
        emails jsonb,
        passwd TEXT,
        timezone integer,
        active boolean,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE user_roles (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id uuid NOT NULL,
        account_id uuid NOT NULL,
        role VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE courses (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        labels jsonb,
        image TEXT,
        video_preview TEXT,
        default_version uuid NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE course_versions (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        course_id uuid NOT NULL,
        account_id uuid NOT NULL,
        name VARCHAR(255),
        description TEXT,
        internal_notes TEXT,
        allow_buy boolean,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE course_modules (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        title VARCHAR(255) NOT NULL,
        course_version_id uuid NOT NULL,
        base_id uuid,
        sort_order integer NOT NULL,
        is_active boolean NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_version_id_fkey" FOREIGN KEY (course_version_id) REFERENCES course_versions (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "base_id_fkey" FOREIGN KEY (base_id) REFERENCES course_modules (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE VIEW module_proxy as (
        select
          id,
          coalesce(base_id, id) as proxy_id,
          course_version_id
        from
          course_modules
      );
    `);
    await queryRunner.query(`
      CREATE TABLE course_lessons (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        course_id uuid NOT NULL,
        course_version_id uuid NOT NULL,
        module_id uuid NOT NULL,
        sort_order integer NOT NULL,
        base_lesson_id uuid,
        type TEXT,
        title VARCHAR(255),
        blocks jsonb,
        status VARCHAR(255),
        release_on_date TIMESTAMP,
        release_after integer,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_version_id_fkey" FOREIGN KEY (course_version_id) REFERENCES course_versions (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "module_id_fkey" FOREIGN KEY (module_id) REFERENCES course_modules (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "base_lesson_id_fkey" FOREIGN KEY (base_lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE VIEW lesson_proxy as (
        select
          id,
          coalesce(base_lesson_id, id) as proxy_id,
          account_id,
          module_id,
          course_version_id,
          course_id,
          status
        from
          course_lessons
      );
    `);
    await queryRunner.query(`
      CREATE TABLE tokens (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        user_id uuid NOT NULL,
        token TEXT NOT NULL,
        scope TEXT NOT NULL,
        used_at TIMESTAMP,
        expires_in TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE enrollments (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        course_id uuid NULL,
        course_version_id uuid NULL,
        user_id uuid NOT NULL,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        transaction_id varchar NULL,
        type varchar NOT NULL,
        status varchar NOT NULL,
        canceled_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_version_id_fkey" FOREIGN KEY (course_version_id) REFERENCES course_versions (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE threads (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        user_id uuid NOT NULL,
        course_id uuid,
        lesson_id uuid,
        module_id uuid,
        title VARCHAR(255) NOT NULL,
        body jsonb NOT NULL,
        tags jsonb,
        is_solved boolean NOT NULL,
        is_ticket boolean NOT NULL,
        is_pinned boolean NOT NULL,
        is_closed boolean NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "module_id_fkey" FOREIGN KEY (module_id) REFERENCES course_modules (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE thread_answers (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        user_id uuid NOT NULL,
        thread_id uuid NOT NULL,
        is_answer boolean NOT NULL,
        is_internal_note boolean,
        body jsonb NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "thread_id_fkey" FOREIGN KEY (thread_id) REFERENCES threads (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE extensions (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id uuid NOT NULL,
        name VARCHAR(255) NOT NULL,
        developer_id uuid,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        version integer,
        permissions jsonb,
        settings jsonb,
        scopes jsonb
      );
    `);
    await queryRunner.query(`
      CREATE TABLE extension_installations (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        extension_id uuid NOT NULL,
        account_id uuid NOT NULL,
        active boolean,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        settings_values jsonb,
        permission_values jsonb,
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "extension_id_fkey" FOREIGN KEY (extension_id) REFERENCES extensions (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE lesson_progress (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        course_id uuid NOT NULL,
        course_version_id uuid NOT NULL,
        lesson_id uuid NOT NULL,
        user_id uuid NOT NULL,
        completed boolean NOT NULL,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_version_id_fkey" FOREIGN KEY (course_version_id) REFERENCES course_versions (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE last_course_access (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        user_id uuid NOT NULL,
        course_id uuid NOT NULL,
        course_version_id uuid NOT NULL,
        module_id uuid NOT NULL,
        lesson_id uuid NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_version_id_fkey" FOREIGN KEY (course_version_id) REFERENCES course_versions (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "module_id_fkey" FOREIGN KEY (module_id) REFERENCES course_modules (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE notifications (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        user_id uuid NOT NULL,
        notified_by uuid,
        type VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL,
        data jsonb NOT NULL,
        read boolean,
        read_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "user_id_fkey" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "notified_by_fkey" FOREIGN KEY (notified_by) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE extension_installations_webhooks (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        installation_id uuid NOT NULL,
        payload jsonb NOT NULL,
        response VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "installation_id_fkey" FOREIGN KEY (installation_id) REFERENCES extension_installations (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE tags (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        course_id uuid NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE offers (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        extension_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(255),
        type VARCHAR(30) NOT NULL,
        sellPage VARCHAR(255) NOT NULL,
        metadata jsonb NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "extension_id_fkey" FOREIGN KEY (extension_id) REFERENCES extensions (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE offer_courses (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        offer_id uuid NOT NULL,
        course_id uuid NOT NULL,
        settings_type VARCHAR(255) NOT NULL,
        settings_version_id uuid,
        settings_period VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "offer_id_fkey" FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE labels (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        label character varying NOT NULL,
        account_id uuid NOT NULL,
        is_private boolean DEFAULT true,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        CONSTRAINT account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE label_course (
        course_id uuid NOT NULL,
        label_id uuid NOT NULL,
        CONSTRAINT course_id_fkey FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT label_id_fkey FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE label_offer (
        offer_id uuid NOT NULL,
        label_id uuid NOT NULL,
        type character varying NOT NULL,
        period character varying NOT NULL,
        CONSTRAINT offer_id_fkey FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT label_id_fkey FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE label_enrollment (
        enrollment_id uuid NOT NULL,
        label_id uuid NOT NULL,
        CONSTRAINT enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES enrollments (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT label_id_fkey FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE media_files (
        id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        account_id uuid NOT NULL,
        url character varying NOT NULL,
        size integer NOT NULL,
        alt_text character varying NOT NULL,
        label jsonb NOT NULL,
        filename character varying NOT NULL,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        CONSTRAINT account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE media_files;
      DROP TABLE label_enrollment;
      DROP TABLE label_offer;
      DROP TABLE label_course;
      DROP TABLE labels;
      DROP TABLE offer_courses;
      DROP TABLE offers;
      DROP TABLE tags;
      DROP TABLE extension_installations_webhooks;
      DROP TABLE notifications;
      DROP TABLE last_course_access;
      DROP TABLE lesson_progress;
      DROP TABLE extension_installations;
      DROP TABLE extensions;
      DROP TABLE thread_answers;
      DROP TABLE threads;
      DROP TABLE enrollments;
      DROP TABLE tokens;
      DROP VIEW lesson_proxy;
      DROP TABLE course_lessons;
      DROP VIEW module_proxy;
      DROP TABLE course_modules;
      DROP TABLE course_versions;
      DROP TABLE courses;
      DROP TABLE user_roles;
      DROP TABLE users;
      DROP TABLE accounts;
    `);
  }
}
