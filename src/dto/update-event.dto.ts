import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
/**
 * DTO para actualizar la información de un evento existente.
 * Todos los campos son opcionales, permitiendo actualizar uno o varios datos del evento.
 */
export class UpdateEventDTO {
  // Nuevo título del evento (opcional).
  @ApiPropertyOptional({ description: 'Nuevo título del evento', minLength: 3, maxLength: 100, example: 'Concierto de Rock' })
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto válido' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title?: string;

  // Nueva descripción del evento (opcional).
  @ApiPropertyOptional({ description: 'Nueva descripción del evento', minLength: 10, maxLength: 500, example: 'Un concierto increíble con artistas internacionales.' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @Length(10, 500, {
    message: 'La descripción debe tener entre 10 y 500 caracteres',
  })
  description?: string;

  // Nueva fecha del evento (opcional, formato ISO).
  @ApiPropertyOptional({ description: 'Nueva fecha del evento', example: '2025-12-31T20:00:00Z', type: String })
  @IsOptional()
  @IsDateString({}, { message: 'Debe ser una fecha válida (formato ISO)' })
  date?: Date;

  // Nueva ubicación del evento (opcional).
  @ApiPropertyOptional({ description: 'Nueva ubicación del evento', minLength: 3, maxLength: 100, example: 'Auditorio Nacional' })
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser texto' })
  @Length(3, 100, {
    message: 'La ubicación debe tener entre 3 y 100 caracteres',
  })
  location?: string;

  // Nueva capacidad máxima del evento (opcional, número entero y positivo).
  @ApiPropertyOptional({ description: 'Nueva capacidad máxima del evento', minimum: 1, example: 500 })
  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacity?: number;
}
