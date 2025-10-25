import { IsEmail, IsNotEmpty, Length } from 'class-validator';

/**
 * DTO utilizado para validar los datos al iniciar sesión.
 * Asegura que se envíen un correo válido y una contraseña con longitud correcta.
 */
export class LoginUserDTO {
  // Correo electrónico del usuario (obligatorio y debe tener formato válido).
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  // Contraseña del usuario (obligatoria, entre 5 y 12 caracteres).
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Length(5, 12, {
    message: 'La contraseña debe tener entre 5 y 12 caracteres',
  })
  password: string;
}
