import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

/**
 * DTO para crear un nuevo evento.
 * Define y valida los datos requeridos para registrar un evento dentro del sistema.
 */
export class CreateEventDTO {
  // Título del evento (obligatorio, entre 3 y 100 caracteres).
  @IsNotEmpty({ message: 'El título del evento es obligatorio' })
  @IsString({ message: 'El título debe ser un texto válido' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title: string;

  // Descripción del evento (obligatoria, entre 10 y 500 caracteres).
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser texto' })
  @Length(10, 500, {
    message: 'La descripción debe tener entre 10 y 500 caracteres',
  })
  description: string;

  // Fecha del evento (obligatoria, formato ISO).
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (formato ISO)' })
  date: Date;

  // Ubicación del evento (obligatoria, entre 3 y 100 caracteres).
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser texto' })
  @Length(3, 100, {
    message: 'La ubicación debe tener entre 3 y 100 caracteres',
  })
  location: string;

  // Capacidad máxima del evento (opcional, número entero y positivo).
  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacity?: number;
}
