import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1722045599168 implements MigrationInterface {
    name = 'InitMigration1722045599168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."winning_combinations_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "winning_combinations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "positions" jsonb NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "match_count" integer NOT NULL, "status" "public"."winning_combinations_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "boardId" integer, CONSTRAINT "PK_45ab33b8786036bd427e6eca766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "boardSize" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board_orders" ("id" SERIAL NOT NULL, "position" integer NOT NULL, "number" integer NOT NULL, "gameId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64c81e733e5e16bbde4f409b70e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69db5e27688ee473b57466da52" ON "board_orders" ("gameId") `);
        await queryRunner.query(`CREATE TABLE "user_draws" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, "numberDraw" integer NOT NULL, "boardPosition" integer NOT NULL, "isMatch" boolean NOT NULL, "isDraw" boolean NOT NULL, "drawAt" TIMESTAMP, "drawTime" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25dc524d9feebda3ef456c176d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gamer_users" ("userId" integer NOT NULL, "gameId" integer NOT NULL, "playerNumbers" jsonb, "isPlayerNumberChosen" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_09d874f5490e3ef39ddf98b9a47" PRIMARY KEY ("userId", "gameId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d9a102b63c5fc061185dce5cd3" ON "gamer_users" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_06b8e35223c092fa2448efbfd8" ON "gamer_users" ("gameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_GAME" ON "gamer_users" ("userId", "gameId") `);
        await queryRunner.query(`CREATE TYPE "public"."games_status_enum" AS ENUM('active', 'inactive', 'done', 'paused')`);
        await queryRunner.query(`CREATE TYPE "public"."games_boardposition_enum" AS ENUM('random', 'sequential')`);
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "randomRepeatAllowed" integer NOT NULL, "status" "public"."games_status_enum" NOT NULL DEFAULT 'active', "duration" integer NOT NULL, "startDate" TIMESTAMP(0), "endDate" TIMESTAMP(0), "pickingDate" TIMESTAMP(0), "boardPosition" "public"."games_boardposition_enum" NOT NULL, "numberPicking" integer, "numberPickFrequency" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, "boardId" integer, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_STATUS" ON "games" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'player', 'sponsor')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'player', "rrs_id" character varying, "rrs_token" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "timezoneId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timezones" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "offset" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_589871db156cc7f92942334ab7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "winning_combinations" ADD CONSTRAINT "FK_6e47472268761acc9aaef0a6295" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_orders" ADD CONSTRAINT "FK_69db5e27688ee473b57466da520" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_draws" ADD CONSTRAINT "FK_da1211b9bcdc46a1c5e54f6b866" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_draws" ADD CONSTRAINT "FK_8a0ade31b5bacda8deee6520623" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gamer_users" ADD CONSTRAINT "FK_d9a102b63c5fc061185dce5cd31" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gamer_users" ADD CONSTRAINT "FK_06b8e35223c092fa2448efbfd8e" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_1f493134f8ca4ab276efa0ab784" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_4b2d5f2011b9a3188876cf55e0b" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f2e8e78ec7c6dabe5fc330bd199" FOREIGN KEY ("timezoneId") REFERENCES "timezones"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f2e8e78ec7c6dabe5fc330bd199"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_4b2d5f2011b9a3188876cf55e0b"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_1f493134f8ca4ab276efa0ab784"`);
        await queryRunner.query(`ALTER TABLE "gamer_users" DROP CONSTRAINT "FK_06b8e35223c092fa2448efbfd8e"`);
        await queryRunner.query(`ALTER TABLE "gamer_users" DROP CONSTRAINT "FK_d9a102b63c5fc061185dce5cd31"`);
        await queryRunner.query(`ALTER TABLE "user_draws" DROP CONSTRAINT "FK_8a0ade31b5bacda8deee6520623"`);
        await queryRunner.query(`ALTER TABLE "user_draws" DROP CONSTRAINT "FK_da1211b9bcdc46a1c5e54f6b866"`);
        await queryRunner.query(`ALTER TABLE "board_orders" DROP CONSTRAINT "FK_69db5e27688ee473b57466da520"`);
        await queryRunner.query(`ALTER TABLE "winning_combinations" DROP CONSTRAINT "FK_6e47472268761acc9aaef0a6295"`);
        await queryRunner.query(`DROP TABLE "timezones"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_STATUS"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TYPE "public"."games_boardposition_enum"`);
        await queryRunner.query(`DROP TYPE "public"."games_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_GAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06b8e35223c092fa2448efbfd8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9a102b63c5fc061185dce5cd3"`);
        await queryRunner.query(`DROP TABLE "gamer_users"`);
        await queryRunner.query(`DROP TABLE "user_draws"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69db5e27688ee473b57466da52"`);
        await queryRunner.query(`DROP TABLE "board_orders"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`DROP TABLE "winning_combinations"`);
        await queryRunner.query(`DROP TYPE "public"."winning_combinations_status_enum"`);
    }

}
