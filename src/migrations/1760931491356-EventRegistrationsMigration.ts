import { MigrationInterface, QueryRunner } from "typeorm";

export class EventRegistrationsMigration1760931491356 implements MigrationInterface {
    name: 'EventRegistrationsMigration1760931491356';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`event_registration\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`registeredAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`userId\` INT NULL,
                \`eventId\` INT NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_registration_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
                CONSTRAINT \`FK_registration_event\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_registration_event\`;`);
        await queryRunner.query(`ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_registration_user\`;`);
        await queryRunner.query(`DROP TABLE \`event_registration\`;`);
    }
}