import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersMigration1760931435243 implements MigrationInterface {
     name = 'UsersMigration1760931435243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`email\` VARCHAR(150) NOT NULL,
                \`password\` VARCHAR(255) NOT NULL,
                \`name\` VARCHAR(100) NOT NULL,
                \`role\` ENUM('admin', 'organizer', 'attendee') NOT NULL DEFAULT 'attendee',
                UNIQUE INDEX \`IDX_user_email\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_user_email\` ON \`user\`;`);
        await queryRunner.query(`DROP TABLE \`user\`;`);
    }
}