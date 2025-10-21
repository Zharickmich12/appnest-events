import { IsInt, IsOptional, IsPositive } from 'class-validator';

/**
 * DTO para actualizar una inscripción existente.
 * Permite modificar el usuario o el evento asociado a una inscripción.
 */
export class UpdateRegistrationDTO {
  // Nuevo ID del usuario (opcional, entero y positivo).
  @IsOptional()
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  userId?: number;
  
  // Nuevo ID del evento (opcional, entero y positivo).
  @IsOptional()
  @IsInt({ message: 'El ID del evento debe ser un número entero' })
  @IsPositive({ message: 'El ID del evento debe ser un número positivo' })
  eventId?: number;
}