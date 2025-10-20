import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedEventsMigration1760933477526 implements MigrationInterface {
    name = 'SeedEventsMigration1760933477526'

    /**
     * Inserta eventos de ejemplo en la tabla `event`.
     * Los organizadores deben existir previamente en la tabla `user`.
     * (usa los IDs correspondientes a los organizadores insertados en SeedUsers)
    */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO event (title, description, date, location, capacity, organizerId)
            VALUES
                (
                    'Conferencia de Tecnología 2025',
                    'Evento sobre las últimas tendencias en desarrollo web y IA.',
                    '2025-11-15 10:00:00',
                    'Centro de Convenciones Bogotá',
                    200,
                    2
                ),
                (
                    'Taller de Emprendimiento',
                    'Sesión práctica para aprender a crear startups sostenibles.',
                    '2025-12-02 09:00:00',
                    'Hub de Innovación Medellín',
                    100,
                    2
                ),
                (
                    'Hackatón 2025',
                    'Competencia intensiva de programación donde equipos desarrollan soluciones tecnológicas innovadoras en 48 horas.',
                    '2025-12-20 08:00:00',
                    'Campus Creativo Cali',
                    300,
                    2
                );
        `);
    }

    //Elimina los registros de eventos creados en el método up.
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM event
            WHERE title IN (
                'Conferencia de Tecnología 2025',
                'Taller de Emprendimiento',
                'Hackatón 2025'
            );
        `);
    }
}