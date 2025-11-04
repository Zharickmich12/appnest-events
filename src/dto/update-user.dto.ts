import { IsEmail, IsIn, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @class UpdateUserDto
 * @description Data Transfer Object (DTO) utilizado para la actualización parcial (PATCH)
 * de los datos de un recurso de tipo User. El diseño soporta el patrón de "actualización atómica",
 * permitiendo que todas las propiedades sean opcionales.
 */
export class UpdateUserDto {
  /**
   * @property {string} name?
   * @description Nombre o alias para el usuario.
   * @type {string}
   * @validation @IsOptional() - Indica que la propiedad es opcional en la solicitud.
   * @validation @IsNotEmpty() - Si se proporciona, el valor no debe ser una cadena vacía.
   */
  @ApiPropertyOptional({ description: 'Nombre completo del usuario', example: 'JUAN PÉREZ' })
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name?: string;

  /**
   * @property {string} email?
   * @description Correo electrónico único del usuario.
   * @type {string}
   * @validation @IsOptional() - Indica que la propiedad es opcional en la solicitud.
   * @validation @IsEmail() - Si se proporciona, debe cumplir con el formato estándar de correo electrónico (RFC 5322).
   */
  @ApiPropertyOptional({ description: 'Correo electrónico del usuario', example: 'usuario@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email?: string;

  /**
   * @property {string} password?
   * @description Contraseña para autenticación.
   * @type {string}
   * @validation @IsOptional() - Indica que la propiedad es opcional en la solicitud.
   * @validation @Length(5, 12) - Si se proporciona, la longitud de la cadena debe estar estrictamente entre 5 y 12 caracteres.
   */
  @ApiPropertyOptional({ description: 'Contraseña del usuario', minLength: 5, maxLength: 12 })
  @IsOptional()
  @Length(5, 12, {
    message: 'La contraseña debe tener entre 5 y 12 caracteres.',
  })
  password?: string;

  /**
   * @property {'admin' | 'organizer' | 'attendee'} role?
   * @description Nivel de permiso o rol asignado al usuario dentro del sistema.
   * @type {'admin' | 'organizer' | 'attendee'}
   * @validation @IsOptional() - Indica que la propiedad es opcional en la solicitud.
   * @validation @IsIn(['admin', 'organizer', 'attendee']) - Si se proporciona, el valor debe coincidir con uno de los roles permitidos (enumeración estricta).
   */
  @ApiPropertyOptional({ description: 'Rol del usuario', enum: ['admin', 'organizer', 'attendee'], example: 'attendee' })
  @IsOptional()
  @IsIn(['admin', 'organizer', 'attendee'], {
    message: 'El rol debe ser admin, organizer o attendee.',
  })
  role?: 'admin' | 'organizer' | 'attendee';
}
