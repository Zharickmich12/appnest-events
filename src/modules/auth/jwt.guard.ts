/**
 * @fileoverview Guard de autenticación JWT
 * @module JwtAuthGuard
 * @description Guard que protege rutas mediante autenticación basada en JSON Web Tokens (JWT).
 * Extiende AuthGuard de Passport.js y utiliza la estrategia 'jwt' para validar tokens.
 * Este guard se ejecuta antes que RolesGuard para asegurar que el usuario está autenticado.
 */

/**
 * Injectable: Decorador que marca la clase como proveedor inyectable
 * Permite que NestJS gestione la instancia y la inyecte donde sea necesario
 */
import { Injectable } from '@nestjs/common';
/**
 * AuthGuard: Clase base de Passport para crear guards de autenticación
 * Proporciona integración entre NestJS y estrategias de Passport.js
 */
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard de autenticación basado en JWT
 *
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 * @decorator @Injectable
 *
 * @description
 * Guard que implementa autenticación mediante JSON Web Tokens (JWT).
 * Extiende AuthGuard de Passport.js y utiliza la estrategia 'jwt' configurada
 * en JwtStrategy para validar tokens en cada petición.
 * @security
 * - Validación de firma con clave secreta (JWT_SECRET)
 * - Verificación de expiración automática
 * - Tokens no pueden ser modificados sin invalidar firma
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
