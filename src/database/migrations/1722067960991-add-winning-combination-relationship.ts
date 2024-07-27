import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWinningCombinationRelationship1722067960991
  implements MigrationInterface
{
  name = 'AddWinningCombinationRelationship1722067960991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gamer_users" ADD "winningCombinationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" ADD "winning_positions" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" ADD "winning_numbers" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" ADD "winningPrice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" ADD CONSTRAINT "FK_c828ad3ebb530d57b2a3106363e" FOREIGN KEY ("winningCombinationId") REFERENCES "winning_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gamer_users" DROP CONSTRAINT "FK_c828ad3ebb530d57b2a3106363e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" DROP COLUMN "winningPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" DROP COLUMN "winning_numbers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" DROP COLUMN "winning_positions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gamer_users" DROP COLUMN "winningCombinationId"`,
    );
  }
}
