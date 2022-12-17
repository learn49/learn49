import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomFields1671234942561 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" ADD "custom_fields" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "course_lessons" ADD "custom_fields" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_modules" ADD "custom_fields" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_modules" DROP COLUMN "custom_fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_lessons" DROP COLUMN "custom_fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "custom_fields"`,
    );
  }
}
