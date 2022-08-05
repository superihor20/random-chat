import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1659622953136 implements MigrationInterface {
  name = 'User1659622953136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(100), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "avatar" character varying, "background" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
