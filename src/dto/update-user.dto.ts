import { IsEmail, IsIn, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email?: string;

  @IsOptional()
  @Length(6, 12, { message: 'La contraseña debe tener entre 6 y 12 caracteres.' })
  password?: string;

  @IsOptional()
  @IsIn(['admin', 'organizer', 'attendee'], { message: 'El rol debe ser admin, organizer o attendee.' })
  role?: 'admin' | 'organizer' | 'attendee';
}