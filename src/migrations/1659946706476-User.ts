import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1659946706476 implements MigrationInterface {
  name = 'User1659946706476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(100), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "avatar" character varying, "banner" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
