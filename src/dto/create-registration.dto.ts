import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class CreateRegistrationDTO
 * @description Data Transfer Object (DTO) utilizado para validar y transportar los
 * identificadores (Foreign Keys) requeridos para la creación de un nuevo registro de inscripción
 * entre un usuario y un evento. Ambos campos son obligatorios.
 */
export class CreateRegistrationDTO {
  // ID del usuario que se inscribe al evento (obligatorio, entero y positivo).
  @ApiProperty({ description: 'ID del usuario que se inscribe', type: Number, example: 1 })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  userId: number;

  // ID del evento al que el usuario se inscribe (obligatorio, entero y positivo).
  @ApiProperty({ description: 'ID del evento al que se inscribe el usuario', type: Number, example: 10 })
  @IsNotEmpty({ message: 'El ID del evento es obligatorio' })
  @IsInt({ message: 'El ID del evento debe ser un número entero' })
  @IsPositive({ message: 'El ID del evento debe ser un número positivo' })
  eventId: number;
}
