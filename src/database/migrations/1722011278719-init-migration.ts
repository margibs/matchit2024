import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1722011278719 implements MigrationInterface {
  name = 'InitMigration1722011278719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "board" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "boardSize" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "board_order" ("id" SERIAL NOT NULL, "position" integer NOT NULL, "number" integer NOT NULL, "gameId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_86018eaef4718438815aec80494" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e1bc2f998d8edfd1c45486da1" ON "board_order" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_draw" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, "numberDraw" integer NOT NULL, "boardPosition" integer NOT NULL, "isMatch" boolean NOT NULL, "isDraw" boolean NOT NULL, "drawAt" TIMESTAMP, "drawTime" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30053038f9a8ff27e12598ecbdc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_user" ("userId" integer NOT NULL, "gameId" integer NOT NULL, "playerNumbers" jsonb, "isPlayerNumberChosen" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0f93345b3ab879825c57b1ef491" PRIMARY KEY ("userId", "gameId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddde1bed56356bff33de8dc8cf" ON "game_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7779a512d9dac56c8bca9c38fb" ON "game_user" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_GAME" ON "game_user" ("userId", "gameId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "randomRepeatAllowed" integer NOT NULL, "status" "public"."game_status_enum" NOT NULL DEFAULT 'active', "duration" integer NOT NULL, "startDate" TIMESTAMP(0), "endDate" TIMESTAMP(0), "pickingDate" TIMESTAMP(0), "boardPosition" "public"."game_boardposition_enum" NOT NULL, "numberPicking" integer, "numberPickFrequency" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, "boardId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_STATUS" ON "game" ("status") `);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'player', "rrs_id" character varying, "rrs_token" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "timezoneId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "timezone" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "offset" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2706edc3223dd1d219f9f6a11b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_order" ADD CONSTRAINT "FK_1e1bc2f998d8edfd1c45486da1c" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_draw" ADD CONSTRAINT "FK_a8fbeb0d92f26acf8bfb34f4fec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_draw" ADD CONSTRAINT "FK_6f709abcb90a757f41cd2842afe" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_user" ADD CONSTRAINT "FK_ddde1bed56356bff33de8dc8cf5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_user" ADD CONSTRAINT "FK_7779a512d9dac56c8bca9c38fb9" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_c4067bea8e37aa944466f92eec0" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_fa3977ef9150e1560382c65d0f8" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1f6de01af7c466db715e2ff8320" FOREIGN KEY ("timezoneId") REFERENCES "timezone"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_1f6de01af7c466db715e2ff8320"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_fa3977ef9150e1560382c65d0f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_c4067bea8e37aa944466f92eec0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_user" DROP CONSTRAINT "FK_7779a512d9dac56c8bca9c38fb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_user" DROP CONSTRAINT "FK_ddde1bed56356bff33de8dc8cf5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_draw" DROP CONSTRAINT "FK_6f709abcb90a757f41cd2842afe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_draw" DROP CONSTRAINT "FK_a8fbeb0d92f26acf8bfb34f4fec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_order" DROP CONSTRAINT "FK_1e1bc2f998d8edfd1c45486da1c"`,
    );
    await queryRunner.query(`DROP TABLE "timezone"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_STATUS"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_USER_GAME"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7779a512d9dac56c8bca9c38fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ddde1bed56356bff33de8dc8cf"`,
    );
    await queryRunner.query(`DROP TABLE "game_user"`);
    await queryRunner.query(`DROP TABLE "user_draw"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e1bc2f998d8edfd1c45486da1"`,
    );
    await queryRunner.query(`DROP TABLE "board_order"`);
    await queryRunner.query(`DROP TABLE "board"`);
  }
}
