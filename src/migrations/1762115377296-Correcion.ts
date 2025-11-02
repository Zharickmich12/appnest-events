import { MigrationInterface, QueryRunner } from 'typeorm';

export class Correcion1762115377296 implements MigrationInterface {
  name = 'Correcion1762115377296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`date\` datetime NOT NULL, \`location\` varchar(255) NOT NULL, \`capacity\` int NOT NULL DEFAULT '100', \`email\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_4ccd63876554023ce6a4e863c2\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`event_registration\` (\`id\` int NOT NULL AUTO_INCREMENT, \`registeredAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`eventId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'attendee', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_registration\` ADD CONSTRAINT \`FK_a4d960e4a113017e7e6b15f14b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_registration\` ADD CONSTRAINT \`FK_ebd16a55e8ad05fdb6cf0b325af\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_ebd16a55e8ad05fdb6cf0b325af\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_a4d960e4a113017e7e6b15f14b9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`event_registration\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4ccd63876554023ce6a4e863c2\` ON \`event\``,
    );
    await queryRunner.query(`DROP TABLE \`event\``);
  }
}
