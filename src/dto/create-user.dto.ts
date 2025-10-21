import { IsEmail, IsIn, IsNotEmpty, Length, IsOptional } from 'class-validator';

// DTO para crear un nuevo usuario.
export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Length(5, 12, { message: 'La contraseña debe tener entre 5 y 12 caracteres.' })
  password: string;

  @IsOptional()
  @IsIn(['admin', 'organizer', 'attendee'], { message: 'El rol debe ser admin, organizer o attendee.' })
  role?: 'admin' | 'organizer' | 'attendee';
}