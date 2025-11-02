/**
 * @fileoverview Decorador personalizado para definir roles requeridos
 * @module Roles
 * @description Define un decorador personalizado @Roles que permite especificar
 * qué roles de usuario pueden acceder a un endpoint específico. Los metadatos
 * establecidos por este decorador son leídos por RolesGuard para autorización.
 */

/**
 * SetMetadata: Función para crear decoradores personalizados que adjuntan
 * metadatos a clases, métodos o propiedades
 */
import { SetMetadata } from '@nestjs/common';

/**
 * UserRole: Enum que define los roles disponibles en el sistema
 * - ADMIN: Administrador con acceso completo
 * - ORGANIZER: Organizador que gestiona eventos
 * - ATTENDEE: Asistente con permisos básicos
 */
import { UserRole } from 'src/entities/user.entity';

/**
 * Clave utilizada para almacenar y recuperar metadatos de roles
 *
 * @constant {string} ROLES_KEY
 * @default 'roles'
 *
 * @description
 * Esta clave se utiliza para:
 * 1. Almacenar los roles requeridos como metadatos en el decorador @Roles
 * 2. Recuperar los roles desde RolesGuard usando Reflector
 *
 * La consistencia de esta clave es crítica para que el guard pueda
 * leer correctamente los metadatos establecidos por el decorador.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorador para asignar roles requeridos a un endpoint
 *
 * @function Roles
 * @param {...UserRole[]} roles - Lista de roles permitidos para el endpoint
 * @returns {CustomDecorator} Decorador que adjunta metadatos de roles
 *
 * @description
 * Decorador personalizado que define qué roles de usuario pueden acceder
 * a un método de controlador específico. Utiliza SetMetadata para adjuntar
 * la lista de roles como metadatos que luego son leídos por RolesGuard.
 *
 * @see RolesGuard Para la implementación del guard que lee estos metadatos
 * @see UserRole Para los roles disponibles en el sistema
 * @see SetMetadata Función de NestJS para crear decoradores personalizados
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
