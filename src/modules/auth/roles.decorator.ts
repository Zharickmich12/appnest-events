// Se importa SetMetadata desde @nestjs/common para crear metadatos personalizados
// que luego pueden ser leidos por los guards (ej: RolesGuard)
import { SetMetadata } from '@nestjs/common';

// Se importa el enum de roles de usuario, que define ADMIN, ORGANIZER y ATTENDEE
import { UserRole } from 'src/entities/user.entity';

// Constante que define la "clave" que se usara para almacenar los roles
// en los metadatos de la ruta, este valor lo leerá el RolesGuard.
export const ROLES_KEY = 'roles';

// Decorador para asignar roles a una ruta (ej: @Roles(UserRole.ADMIN))
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
