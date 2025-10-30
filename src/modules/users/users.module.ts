/**
 * @fileoverview Módulo de gestión de usuarios
 * @module UsersModule
 * @description Define y configura el módulo de usuarios, incluyendo controlador,
 * servicio y repositorio de TypeORM para la entidad User. Exporta el servicio
 * para ser utilizado por otros módulos (ej: AuthModule).
 */
/**
 * Module: Decorador que define un módulo de NestJS
 */
import { Module } from '@nestjs/common';
/**
 * Controlador que maneja las rutas HTTP de usuarios
 */
import { UsersController } from './users.controller';
/**
 * Servicio con la lógica de negocio de usuarios
 */
import { UsersService } from './users.service';
/**
 * TypeOrmModule: Módulo de integración de TypeORM
 */
import { TypeOrmModule } from '@nestjs/typeorm';
/**
 * Entidad User para operaciones de base de datos
 */
import { User } from 'src/entities/user.entity';

/**
 * Módulo de usuarios
 * 
 * @class UsersModule
 * @decorator @Module
 * 
 * @description
 * Encapsula toda la funcionalidad relacionada con usuarios:
 * - Controlador: Define endpoints HTTP (GET, POST, PUT, DELETE)
 * - Servicio: Implementa lógica de negocio y operaciones CRUD
 * - Repositorio: Proporciona acceso a la tabla 'user' mediante TypeORM
 * 
 * El servicio se exporta para permitir su uso en otros módulos,
 * especialmente en AuthModule para validación de credenciales.
 * 
 * @property {Array} imports - Módulos importados
 * @property {Array} controllers - Controladores del módulo
 * @property {Array} providers - Servicios disponibles
 * @property {Array} exports - Servicios exportados para otros módulos
 * 
 */
@Module({
  /**
   * TypeOrmModule.forFeature()
   * Registra la entidad User en el contexto de TypeORM
   * 
   * @description
   * Permite inyectar Repository<User> en servicios usando @InjectRepository(User).
   * TypeORM crea automáticamente el repositorio con métodos CRUD predefinidos.
   * 
   * El repositorio proporciona acceso a la tabla 'user' definida en la entidad.
   */
  imports: [TypeOrmModule.forFeature([User])],
  /**
   * Controladores registrados en el módulo
   * 
   * @property {UsersController} UsersController - Maneja rutas /users
   * 
   * @description
   * UsersController define los siguientes endpoints:
   * - POST   /users       → Crear usuario
   * - GET    /users       → Listar todos los usuarios
   * - GET    /users/:id   → Obtener usuario por ID
   * - PUT    /users/:id   → Actualizar usuario
   * - DELETE /users/:id   → Eliminar usuario
   * 
   * Todas las rutas están protegidas por JwtAuthGuard y RolesGuard.
   */
  controllers: [UsersController],
  /**
   * Servicios disponibles en el módulo
   * 
   * @property {UsersService} UsersService - Lógica de negocio de usuarios
   * 
   * @description
   * UsersService implementa operaciones CRUD y validaciones:
   * - create(): Registro de usuarios con hash de contraseñas
   * - findAll(): Listado completo de usuarios
   * - findOne(): Búsqueda por ID
   * - update(): Actualización con validaciones
   * - remove(): Eliminación de usuarios
   */
  providers: [UsersService],
  /**
   * Servicios y módulos exportados para uso en otros módulos
   * 
   * @exports {UsersService} - Permite inyectar el servicio en otros módulos
   * @exports {TypeOrmModule} - Permite inyectar Repository<User> en otros módulos
   * 
   * @description
   * UsersService se exporta principalmente para AuthModule, que necesita:
   * - Buscar usuarios por email para autenticación
   * - Validar credenciales durante el login
   * 
   * TypeOrmModule se exporta para permitir acceso directo al repositorio
   * en módulos que necesiten consultas específicas sin duplicar lógica.
   */
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
