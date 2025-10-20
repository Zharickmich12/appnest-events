// Migración que crea la tabla `event` en la base de datos.
// Contiene los campos principales de la entidad Event y una clave foránea hacia la tabla `user` (organizer).
import { MigrationInterface, QueryRunner } from "typeorm";

export class EventsMigration1760931482242 implements MigrationInterface {
    name = 'EventsMigration1760931482242';

    /**
     * Método up:
     * Se ejecuta al aplicar la migración.
     * Crea la tabla `event` con las siguientes columnas:
     * - id: identificador único autoincremental
     * - title: título del evento (obligatorio)
     * - description: descripción detallada del evento (obligatorio)
     * - date: fecha y hora del evento (obligatorio)
     * - location: ubicación del evento (obligatorio)
     * - capacity: capacidad máxima de asistentes (por defecto 100)
     * - organizerId: referencia al id del usuario organizador (puede ser NULL)
     * Además, se establece una restricción de clave foránea `FK_event_organizer` hacia `user(id)`.
    */
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

    /**
     * Método down:
     * Se ejecuta al revertir la migración.
     * Elimina la restricción de clave foránea y luego la tabla `event`.
    */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_event_organizer\`;`);
        await queryRunner.query(`DROP TABLE \`event\`;`);
    }
}