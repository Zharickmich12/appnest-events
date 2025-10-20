import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUsersMigration1760933020351 implements MigrationInterface {
    name = 'SeedUsersMigration1760933020351'

    /**
     * Inserta usuarios iniciales en la tabla `user`.
     * Incluye tres roles distintos para pruebas:
     * - Admin
     * - Organizer
     * - Attendee (por defecto)
    */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO user (email, password, name, role)
        VALUES
            ('admin@example.com', '12345', 'Admin', 'admin'),
            ('organizer@example.com', '12345', 'Organizer', 'organizer'),
            ('attendee@example.com', '12345', 'Attendee', 'attendee');
        `);
    }

     //Elimina los usuarios insertados en el método up.
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM user WHERE email IN (
            'admin@example.com',
            'organizer@example.com',
            'attendee@example.com'
        );
        `);
    }
}