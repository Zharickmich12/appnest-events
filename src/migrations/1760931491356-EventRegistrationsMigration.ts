// Migración que crea la tabla `event_registration` en la base de datos.
// Gestiona las inscripciones de los usuarios a los eventos y registra la fecha de registro.
import { MigrationInterface, QueryRunner } from "typeorm";

export class EventRegistrationsMigration1760931491356 implements MigrationInterface {
    name: 'EventRegistrationsMigration1760931491356';

    /**
     * Método up:
     * Se ejecuta al aplicar la migración.
     * Crea la tabla `event_registration` con las siguientes columnas:
     * - id: identificador único autoincremental
     * - registeredAt: fecha de registro de la inscripción (por defecto CURRENT_TIMESTAMP)
     * - userId: referencia al id del usuario inscrito (puede ser NULL)
     * - eventId: referencia al id del evento (puede ser NULL)
     * Además, se crean las siguientes claves foráneas:
     * - FK_registration_user: referencia a user(id), ON DELETE SET NULL, ON UPDATE CASCADE
     * - FK_registration_event: referencia a event(id), ON DELETE CASCADE, ON UPDATE CASCADE
    */
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

    /**
     * Método down:
     * Se ejecuta al revertir la migración.
     * Elimina primero las claves foráneas y luego la tabla `event_registration`.
    */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_registration_event\`;`);
        await queryRunner.query(`ALTER TABLE \`event_registration\` DROP FOREIGN KEY \`FK_registration_user\`;`);
        await queryRunner.query(`DROP TABLE \`event_registration\`;`);
    }
}