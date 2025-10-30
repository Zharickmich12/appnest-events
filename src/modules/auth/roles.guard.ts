/**
 * @fileoverview Guard de autorización basado en roles
 * @module RolesGuard
 * @description Implementa control de acceso basado en roles (RBAC - Role-Based Access Control).
 * Valida que el usuario autenticado tenga uno de los roles requeridos por el endpoint
 * antes de permitir el acceso. Trabaja en conjunto con el decorador @Roles y JwtAuthGuard.
 */

/**
 * Injectable: Marca la clase como proveedor inyectable
 * CanActivate: Interface que define un guard en NestJS
 * ExecutionContext: Proporciona acceso al contexto de ejecución de la petición
 * ForbiddenException: Excepción HTTP 403 para acceso denegado
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
/**
 * Reflector: Utilidad para leer metadatos adjuntos a clases y métodos
 */
import { Reflector } from '@nestjs/core';
/**
 * ROLES_KEY: Clave utilizada para almacenar/leer metadatos de roles
 */
import { ROLES_KEY } from 'src/modules/auth/roles.decorator';
/**
 * UserRole: Enum que define los roles del sistema (ADMIN, ORGANIZER, ATTENDEE)
 */
import { UserRole } from 'src/entities/user.entity';

/**
 * Tipo que representa al usuario dentro del objeto request
 * 
 * @typedef {Object} RequestUser
 * @property {number} id - ID único del usuario
 * @property {string} email - Email del usuario
 * @property {UserRole} role - Rol del usuario (ADMIN, ORGANIZER, ATTENDEE)
 * 
 * @description
 * Este tipo define la estructura del objeto user que JwtAuthGuard
 * inyecta en request.user después de validar el token JWT.
 * 
 * Los datos provienen del payload del JWT decodificado:
 * - id: userId del token
 * - email: Email extraído del token
 * - role: Rol del usuario almacenado en la base de datos
 */
type RequestUser = {
  id: number;
  email: string;
  role: UserRole;
};

/**
 * Guard de autorización basado en roles
 * 
 * @class RolesGuard
 * @implements {CanActivate}
 * @decorator @Injectable
 * 
 * @description
 * Implementa control de acceso basado en roles (RBAC).
 * Este guard se ejecuta después de JwtAuthGuard y valida que el usuario
 * tenga uno de los roles requeridos por el endpoint.
 * 
 * **Flujo de ejecución**:
 * 1. Lee los roles requeridos de los metadatos del endpoint (@Roles decorator)
 * 2. Si no hay roles requeridos, permite acceso (endpoint público autenticado)
 * 3. Obtiene el usuario del request (inyectado por JwtAuthGuard)
 * 4. Valida que el usuario exista (está autenticado)
 * 5. Verifica que el rol del usuario esté en la lista de roles permitidos
 * 6. Permite o deniega el acceso según el resultado
 * 
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Constructor del guard
   * 
   * @constructor
   * @param {Reflector} reflector - Servicio para leer metadatos
   * 
   * @description
   * Inyecta Reflector para acceder a los metadatos de roles
   * establecidos por el decorador @Roles en los endpoints.
   * 
   * Reflector permite leer metadatos adjuntos mediante SetMetadata.
   */
  constructor(private reflector: Reflector) {} 

  /**
   * Valida si el usuario tiene permiso para acceder a la ruta
   * 
   * @method canActivate
   * @param {ExecutionContext} context - Contexto de ejecución de la petición
   * @returns {boolean} true si el acceso es permitido, false o excepción si no
   * @throws {ForbiddenException} Si el usuario no tiene el rol requerido
   * 
   * @description
   * Método principal del guard que implementa la lógica de autorización.
   * Se ejecuta automáticamente por NestJS antes de procesar la petición.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no requiere roles, se permite el acceso
    if (!requiredRoles) return true;

    // Obtenemos el request HTTP y tipamos al usuario que viene en el JWT
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    // Si no hay usuario autenticado, se lanza excepción de acceso denegado
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado.');
    }

    // Verificamos si el rol del usuario esta dentro de los permitidos
    const hasRole = requiredRoles.includes(user.role);

    // Si el usuario no tiene el rol requerido, se lanza ForbiddenException
    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Rol actual: ${user.role}. Se requiere uno de: ${requiredRoles.join(
          ', ',
        )}`,
      );
    }
    /** 
     * Si todas las validaciones pasaron:
     * ✓ Hay roles requeridos definidos
     * ✓ El usuario está autenticado
     * ✓ El usuario tiene uno de los roles permitidos
     * 
     * Se retorna true para permitir que la petición continúe
     * hacia el controlador y ejecute el método correspondiente.
     */
    return true;
  }
}
