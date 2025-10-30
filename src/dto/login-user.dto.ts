import { IsEmail, IsNotEmpty, Length } from 'class-validator';

/**
 * @class LoginUserDTO
 * @description Data Transfer Object (DTO) utilizado exclusivamente para validar los datos
 * requeridos en el proceso de inicio de sesión (Login/Autenticación). 
 * Todos los campos son obligatorios y tienen restricciones estrictas de formato.
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
