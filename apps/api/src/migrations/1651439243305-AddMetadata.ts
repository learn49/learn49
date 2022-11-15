import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetadata1651439243305 implements MigrationInterface {
  name = 'AddMetadata1651439243305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_lessons" ADD "metadata" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_modules" ADD "metadata" jsonb`,
    );
    await queryRunner.query(`ALTER TABLE "courses" ADD "metadata" jsonb`);
    await queryRunner.query(`ALTER TABLE "users" ADD "metadata" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "course_modules" DROP COLUMN "metadata"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_lessons" DROP COLUMN "metadata"`,
    );
  }
}
