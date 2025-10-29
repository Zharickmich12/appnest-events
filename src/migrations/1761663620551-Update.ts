/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1761663620551 implements MigrationInterface {
    name = 'Update1761663620551'
     // Crear tabla de eventos
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla de eventos
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`date\` datetime NOT NULL, \`location\` varchar(255) NOT NULL, \`capacity\` int NOT NULL DEFAULT '100', \`email\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // Crear tabla para registrar usuarios en eventos
        await queryRunner.query(`CREATE TABLE \`event_registration\` (\`id\` int NOT NULL AUTO_INCREMENT, \`registeredAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`eventId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // Crear tabla de usuarios
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'attendee', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // Agregar clave foranea
        // Establece la relacion entre 'event_registration.userId' y 'user.id'
        await queryRunner.query(`ALTER TABLE \`event_registration\` ADD CONSTRAINT \`FK_a4d960e4a113017e7e6b15f14b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // Agregar clave foranea
        // Establece la relacion entre 'event_registration.eventId' y 'event.id'
        await queryRunner.query(`ALTER TABLE \`event_registration\` ADD CONSTRAINT \`FK_ebd16a55e8ad05fdb6cf0b325af\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
     // Metodo que se ejecuta al revertir la migracion (elimina tablas y relaciones)
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_ebd16a55e8ad05fdb6cf0b325af\``);
        await queryRunner.query(`ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_a4d960e4a113017e7e6b15f14b9\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`event_registration\``);
        await queryRunner.query(`DROP TABLE \`event\``);
    }

}
