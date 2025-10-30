import { IsEmail, IsIn, IsNotEmpty, Length, IsOptional } from 'class-validator';

/**
 * @class CreateUserDto
 * @description Data Transfer Object (DTO) utilizado para validar y transportar los datos
 * necesarios para la creación inicial de una nueva entidad User (registro).
 * Establece requisitos estrictos para los campos obligatorios.
 */
export class CreateUserDto {
  // Nombre completo del usuario (obligatorio).
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  // Correo electrónico único y válido (obligatorio).
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  // Contraseña entre 5 y 12 caracteres (obligatoria).
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Length(5, 12, {
    message: 'La contraseña debe tener entre 5 y 12 caracteres.',
  })
  password: string;

  // Rol del usuario dentro del sistema (opcional).
  // Puede ser 'admin', 'organizer' o 'attendee'. Valor por defecto: 'attendee'.
  @IsOptional()
  @IsIn(['admin', 'organizer', 'attendee'], {
    message: 'El rol debe ser admin, organizer o attendee.',
  })
  role?: 'admin' | 'organizer' | 'attendee';
}
