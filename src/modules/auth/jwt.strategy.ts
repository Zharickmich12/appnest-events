/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @file jwt.strategy.ts
 * @description Estrategia Passport que valida los tokens JWT emitidos.
 * Se encarga de extraer el token, verificar su firma y devolver los datos del usuario.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

/**
 * @class JwtStrategy
 * @extends PassportStrategy(Strategy, 'jwt')
 * Estrategia que define cómo se valida el JWT.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      // Extrae el JWT del encabezado 'Authorization' como 'Bearer Token'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No ignora expiración del token, respeta tiempos definidos.
      ignoreExpiration: false,
      // Clave secreta para validar la firma del token.
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  /**
   * @method validate
   * @description Valida el payload del token decodificado.
   * Este método se ejecuta automáticamente si el token es válido.
   * @param payload Objeto decodificado del token.
   * @returns Datos básicos del usuario que se inyectan en `req.user`.
   */
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
