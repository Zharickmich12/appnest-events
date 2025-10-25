/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @file auth.controller.ts
 * @description Controlador responsable de manejar las rutas relacionadas con la autenticación:
 * registro de usuarios y login.
 */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { JwtAuthGuard } from './jwt.guard';

/**
 * Controlador principal para rutas /auth.
 */
@Controller('auth')
export class AuthController {
  /**
   * Inyección de dependencia del servicio AuthService,
   * que contiene la lógica de autenticación.
   */
  constructor(private readonly authService: AuthService) {}
  /**
   * @route POST /auth/register
   * @description Endpoint para registrar nuevos usuarios.
   * @param data Datos del nuevo usuario (DTO con validaciones).
   * @returns Objeto con mensaje de éxito y datos del usuario creado.
   */
  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  /**
   * @route POST /auth/login
   * @description Endpoint para autenticar usuarios y generar el token JWT.
   * @param data DTO con email y password del usuario.
   * @returns Objeto con el token de acceso (accessToken).
   */
  @Post('login')
  async login(@Body() data: LoginUserDTO) {
    return this.authService.login(data);
  }

  /**
   * @route GET /auth/profile
   * @description Endpoint para ver el perfil del usuario
   * ruta protegida que requiere un token JWT valido.
   * @returns Informacion del usuario autenticado.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
