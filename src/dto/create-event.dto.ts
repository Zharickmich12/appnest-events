import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateEventDTO {
  @IsNotEmpty({ message: 'El título del evento es obligatorio' })
  @IsString({ message: 'El título debe ser un texto válido' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  title: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser texto' })
  @Length(10, 500, { message: 'La descripción debe tener entre 10 y 500 caracteres' })
  description: string;

  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (formato ISO)' })
  date: Date;

  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser texto' })
  @Length(3, 100, { message: 'La ubicación debe tener entre 3 y 100 caracteres' })
  location: string;

  @IsOptional()
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacity?: number;
}