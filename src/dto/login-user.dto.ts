import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Length(5, 10, { message: 'La contraseña debe tener entre 5 y 10 caracteres' })
  password: string;
}