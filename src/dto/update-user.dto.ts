import { IsEmail, IsIn, IsNotEmpty, IsOptional, Length } from 'class-validator';

/**
 * DTO para actualizar la información de un usuario existente.
 * Todos los campos son opcionales, ya que el usuario puede modificar solo algunos datos.
 */
export class UpdateUserDto {
  // Nuevo nombre del usuario (opcional).
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name?: string;

  // Nuevo correo electrónico válido (opcional).
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email?: string;

  // Nueva contraseña entre 5 y 12 caracteres (opcional).
  @IsOptional()
  @Length(5, 12, { message: 'La contraseña debe tener entre 5 y 12 caracteres.' })
  password?: string;

   // Rol actualizado del usuario dentro del sistema (opcional).
  @IsOptional()
  @IsIn(['admin', 'organizer', 'attendee'], { message: 'El rol debe ser admin, organizer o attendee.' })
  role?: 'admin' | 'organizer' | 'attendee';
}