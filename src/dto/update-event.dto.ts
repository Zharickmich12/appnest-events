import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

/**
 * DTO para actualizar la información de un evento existente.
 * Todos los campos son opcionales, permitiendo actualizar uno o varios datos del evento.
 */
export class UpdateEventDTO {
  // Nuevo título del evento (opcional).
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto válido' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title?: string;

  // Nueva descripción del evento (opcional).
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @Length(10, 500, {
    message: 'La descripción debe tener entre 10 y 500 caracteres',
  })
  description?: string;

  // Nueva fecha del evento (opcional, formato ISO).
  @IsOptional()
  @IsDateString({}, { message: 'Debe ser una fecha válida (formato ISO)' })
  date?: Date;

  // Nueva ubicación del evento (opcional).
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser texto' })
  @Length(3, 100, {
    message: 'La ubicación debe tener entre 3 y 100 caracteres',
  })
  location?: string;

  // Nueva capacidad máxima del evento (opcional, número entero y positivo).
  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacity?: number;
}
