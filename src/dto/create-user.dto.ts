import { IsEmail, IsIn, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class CreateUserDto
 * @description Data Transfer Object (DTO) utilizado para validar y transportar los datos
 * necesarios para la creación inicial de una nueva entidad User (registro).
 * Establece requisitos estrictos para los campos obligatorios.
 */
export class CreateUserDto {
  // Nombre completo del usuario (obligatorio).
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  // Correo electrónico único y válido (obligatorio).
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'juan@gmail.com' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  // Contraseña entre 5 y 12 caracteres (obligatoria).
  @ApiProperty({ description: 'Contraseña del usuario', minLength: 5, maxLength: 12, example: '123456' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Length(5, 12, {
    message: 'La contraseña debe tener entre 5 y 12 caracteres.',
  })
  password: string;

  // Rol del usuario dentro del sistema (opcional).
  // Puede ser 'admin', 'organizer' o 'attendee'. Valor por defecto: 'attendee'.
  @ApiProperty({ description: 'Rol del usuario', enum: ['admin', 'organizer', 'attendee'], required: false, example: 'attendee' })
  @IsOptional()
  @IsIn(['admin', 'organizer', 'attendee'], {
    message: 'El rol debe ser admin, organizer o attendee.',
  })
  role?: 'admin' | 'organizer' | 'attendee';
}
