import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

/**
 * DTO para crear un nuevo registro de inscripción a un evento.
 * Valida que se proporcionen correctamente los IDs del usuario y del evento.
 */
export class CreateRegistrationDTO {
  // ID del usuario que se inscribe al evento (obligatorio, entero y positivo).
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  userId: number;

  // ID del evento al que el usuario se inscribe (obligatorio, entero y positivo).
  @IsNotEmpty({ message: 'El ID del evento es obligatorio' })
  @IsInt({ message: 'El ID del evento debe ser un número entero' })
  @IsPositive({ message: 'El ID del evento debe ser un número positivo' })
  eventId: number;
}
