import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @class UpdateRegistrationDTO
 * @description Data Transfer Object (DTO) utilizado para la actualización parcial (PATCH) de una inscripción existente.
 * Diseñado para permitir la modificación atómica de las referencias foráneas: userId y eventId.
 */
export class UpdateRegistrationDTO {
  /**
   * @property {number} userId?
   * @description Nuevo Identificador único del usuario asociado a la inscripción.
   * @type {number}
   * @validation @IsOptional() - Indica que la propiedad es opcional en la solicitud.
   * @validation @IsInt() - Si se proporciona, el valor debe ser un número entero (sin decimales).
   * @validation @IsPositive() - Si se proporciona, el valor debe ser un número positivo (mayor que cero).
   */
  @ApiPropertyOptional({ description: 'Nuevo ID del usuario', example: 1, minimum: 1 })
  @IsOptional()
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  userId?: number;

  /**
   * @property {number} eventId?
   * @description Nuevo Identificador único del evento asociado a la inscripción.
   * @type {number}
   * @validation @IsOptional() - Indica que la propiedad es opcional en la solicitud.
   * @validation @IsInt() - Si se proporciona, el valor debe ser un número entero.
   * @validation @IsPositive() - Si se proporciona, el valor debe ser un número positivo.
   */
  @ApiPropertyOptional({ description: 'Nuevo ID del evento', example: 2, minimum: 1 })
  @IsOptional()
  @IsInt({ message: 'El ID del evento debe ser un número entero' })
  @IsPositive({ message: 'El ID del evento debe ser un número positivo' })
  eventId?: number;
}
