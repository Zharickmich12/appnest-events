import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedEventRegistrationMigration1760933989368 implements MigrationInterface {
    name = 'SeedEventRegistrationMigration1760933989368'

    /**
     * Inserta registros de inscripción de usuarios a eventos de ejemplo.
    */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO event_registration (userId, eventId, registeredAt)
            VALUES
                (1, 1, NOW()),  -- Usuario 1 inscrito en Evento 1
                (1, 2, NOW()),  -- Usuario 1 inscrito en Evento 2
                (2, 3, NOW()),  -- Usuario 2 inscrito en Evento 3
                (3, 1, NOW()),  -- Usuario 3 inscrito en Evento 1
                (3, 3, NOW());  -- Usuario 3 inscrito en Evento 3
        `);
    }

    /**
     * Elimina los registros insertados por este seed.
    */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM event_registration
            WHERE (userId, eventId) IN 
                ((1, 1), (1, 2), (2, 3), (3, 1), (3, 3));
        `);
    }
}