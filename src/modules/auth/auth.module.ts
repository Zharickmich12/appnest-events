/**
 * @file auth.module.ts
 * @description Módulo encargado de la autenticación de usuarios y manejo de credenciales.
 * Gestiona el inicio de sesión, validación, emisión de tokens JWT y protección de rutas.
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

/**
 * Decorador @Module()
 * Define la estructura, dependencias y componentes del módulo de autenticación.
 */
@Module({

  // Importa la configuración global (.env) y el módulo TypeORM.
  imports:[
    ConfigModule.forRoot({isGlobal:true}),
    // Registro de la entidad User para que TypeORM pueda interactuar con la tabla `user`
    TypeOrmModule.forFeature([User]),
    // Configura Passport con la estrategia por defecto 'jwt'
    PassportModule.register({defaultStrategy: 'jwt'}),

    // Configura el módulo JWT usando variables del entorno (.env).
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        secret: config.get<string>('JWT_SECRET_KEY'),// Clave secreta para firmar el token
        // Opciones de firma, obtiene tiempo de expiración de entorno o usa '1h' por defecto
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN' as string) || '1h' as any}

      })
    })
  ],

  // Controlador que maneja las rutas de autenticación (login, registro, etc.).
  controllers: [AuthController],
  // Servicios y estrategias disponibles dentro del módulo.
  providers: [AuthService, UsersService, JwtStrategy]
})
export class AuthModule {}
