import { MigrationInterface, QueryRunner } from "typeorm";

export class EventsMigration1760931482242 implements MigrationInterface {
    name = 'EventsMigration1760931482242';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`event\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`title\` VARCHAR(150) NOT NULL,
                \`description\` TEXT NOT NULL,
                \`date\` DATETIME NOT NULL,
                \`location\` VARCHAR(200) NOT NULL,
                \`capacity\` INT NOT NULL DEFAULT 100,
                \`organizerId\` INT NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_event_organizer\` FOREIGN KEY (\`organizerId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_event_organizer\`;`);
        await queryRunner.query(`DROP TABLE \`event\`;`);
    }
}