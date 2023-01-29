import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFieldsToCourse1674954621585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "takeaway" VARCHAR(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "related_courses" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "next_up_courses" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "required_courses" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "required_courses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "next_up_courses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "related_courses"`,
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "takeaway"`);
  }
}
