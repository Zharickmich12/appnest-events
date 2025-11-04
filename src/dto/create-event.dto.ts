import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  IsEmail,
} from 'class-validator';
import { 
  ApiProperty, 
  ApiPropertyOptional 
} from '@nestjs/swagger';

/**
 * @class CreateEventDTO
 * @description Data Transfer Object (DTO) utilizado para validar y transportar los datos
 * esenciales requeridos para la creación de una nueva entidad Event.
 * La mayoría de los campos son obligatorios para el registro inicial del evento.
 */
export class CreateEventDTO {
  // Título del evento (obligatorio, entre 3 y 100 caracteres).
  @ApiProperty({ description: 'Título del evento', minLength: 3, maxLength: 100 }) 
  @IsNotEmpty({ message: 'El título del evento es obligatorio' })
  @IsString({ message: 'El título debe ser un texto válido' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title: string;

  // Descripción del evento (obligatoria, entre 10 y 500 caracteres).
  @ApiProperty({ description: 'Descripción del evento', minLength: 10, maxLength: 500 }) 
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser texto' })
  @Length(10, 500, {
    message: 'La descripción debe tener entre 10 y 500 caracteres',
  })
  description: string;

  // Fecha del evento (obligatoria, formato ISO).
  @ApiProperty({ description: 'Fecha del evento (ISO)', type: String, example: '2025-11-03T00:00:00Z' })
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (formato ISO)' })
  date: Date;

  // Ubicación del evento (obligatoria, entre 3 y 100 caracteres).
  @ApiProperty({ description: 'Ubicación del evento', minLength: 3, maxLength: 100 })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser texto' })
  @Length(3, 100, {
    message: 'La ubicación debe tener entre 3 y 100 caracteres',
  })
  location: string;

  // Capacidad máxima del evento (opcional, número entero y positivo).
  @ApiPropertyOptional({ description: 'Capacidad máxima del evento', type: Number })
  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacity?: number;

  // Correo electronico asociado al evento osea la persona responsable (obligatorio)
  @ApiProperty({ description: 'Correo electrónico responsable del evento', example: 'organizer@gmail.com' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;
}
