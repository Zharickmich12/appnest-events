import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';

// Definicion del tipo que representa al usuario dentro del request
type RequestUser = {
  id: number;
  email: string;
  role: UserRole;
};

@Injectable() // se marca como Injectable para poderse usar en otros lugares
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Reflector para leer metadatos de roles

  // Valida si el usuario tiene permiso para acceder a la ruta
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
    // Si pasa todas las verificaciones, se permite el acceso a la ruta
    return true;
  }
}
