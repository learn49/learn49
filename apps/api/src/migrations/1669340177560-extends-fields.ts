import { MigrationInterface, QueryRunner } from 'typeorm';

export class extendsFields1669340177560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" ADD "slug" VARCHAR(255)`);
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "duration" VARCHAR(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_lessons" ADD "slug" VARCHAR(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_lessons" ADD "description" VARCHAR(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_lessons" ADD "duration" VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "slug"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "duration"`);
    await queryRunner.query(`ALTER TABLE "course_lessons" DROP COLUMN "slug"`);
    await queryRunner.query(
      `ALTER TABLE "course_lessons" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_lessons" DROP COLUMN "duration"`,
    );
  }
}
