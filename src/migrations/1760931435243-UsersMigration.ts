// Migración que crea la tabla `user` en la base de datos.
// Contiene los campos principales de la entidad User y un índice único en el correo electrónico.
import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersMigration1760931435243 implements MigrationInterface {
     name = 'UsersMigration1760931435243'

    /**
     * Método up:
     * Se ejecuta al aplicar la migración.
     * Crea la tabla `user` con las siguientes columnas:
     * - id: identificador único autoincremental
     * - email: correo electrónico único (obligatorio)
     * - password: contraseña del usuario (obligatorio)
     * - name: nombre del usuario (obligatorio)
     * - role: rol del usuario, con valores posibles 'admin', 'organizer', 'attendee' (por defecto 'attendee')
     * Además, se crea un índice único sobre el campo email.
    */
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

    /**
     * Método down:
     * Se ejecuta al revertir la migración.
     * Elimina el índice único sobre el campo email y luego la tabla `user`.
    */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_user_email\` ON \`user\`;`);
        await queryRunner.query(`DROP TABLE \`user\`;`);
    }
}