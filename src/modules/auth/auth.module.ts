// Módulo encargado de la autenticación de usuarios y manejo de credenciales.
// Gestiona el inicio de sesión, validación y protección de rutas.

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';

// Decorador @Module:
// Define la estructura y dependencias del módulo de autenticación.
@Module({

  // Importa la configuración global (.env) y el módulo TypeORM.
  imports:[
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forFeature([User]),
  ],

  // Controlador que maneja las rutas de autenticación (login, registro, etc.).
  controllers: [AuthController],
  // Servicios disponibles en el módulo: lógica de autenticación y acceso a usuarios.
  providers: [AuthService, UsersService]
})
export class AuthModule {}
