/**
 * @fileoverview Controlador de usuarios
 * @module UsersController
 * @description Maneja las solicitudes HTTP relacionadas con la gestión de usuarios.
 * Define endpoints CRUD protegidos con autenticación JWT y autorización basada en roles.
 * Todas las rutas requieren rol ADMIN excepto donde se especifique lo contrario.
 */

/**
 * Decoradores de NestJS para definir controladores y rutas HTTP
 */
import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseFilters,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
/**
 * Servicio con la lógica de negocio de usuarios
 */
import { UsersService } from './users.service';
/**
 * DTOs para validación de datos de entrada
 */
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

/**
 * Pipe personalizado para parseo y validación de parámetros enteros
 */
import { ParseIntPipeCustom } from 'src/common/pipes/parse-int.pipe';
/**
 * Filtro para manejo centralizado de excepciones HTTP
 */
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
/**
 * Interceptor para sanitización y formateo de respuestas
 */
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

/**
 * Guard para validación de tokens JWT
 */
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
/**
 * Decorador personalizado para especificar roles requeridos
 */
import { Roles } from 'src/modules/auth/roles.decorator';
/**
 * Decorador personalizado para especificar roles requeridos
 */
import { RolesGuard } from 'src/modules/auth/roles.guard';
/**
 * Enum con los roles de usuario disponibles
 */
import { UserRole } from 'src/entities/user.entity';

/**
 * Controlador de usuarios
 *
 * @class UsersController
 * @decorator @Controller('users')
 *
 * @description
 * Maneja todas las operaciones CRUD relacionadas con usuarios.
 * Prefijo de ruta: /users
 *
 * Todas las rutas están protegidas por:
 * - JwtAuthGuard: Requiere token JWT válido
 * - RolesGuard: Verifica roles mediante decorador @Roles
 * - HttpExceptionFilter: Formatea errores HTTP de manera consistente
 * - SanitizeResponseInterceptor: Elimina datos sensibles (ej: password)
 *
 * Seguridad:
 * - Solo usuarios con rol ADMIN pueden acceder a todos los endpoints
 * - Los tokens JWT deben incluirse en el header Authorization: Bearer <token>
 * - Las contraseñas nunca se retornan en las respuestas (sanitizadas)
 */

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas del controlador
@UseFilters(HttpExceptionFilter) // Aplica el filtro a todas las rutas de este controlador
@UseInterceptors(SanitizeResponseInterceptor) // Interceptor para formatear respuestas y eliminar datos sensibles
export class UsersController {
  /**
   * Constructor del controlador
   *
   * @constructor
   * @param {UsersService} usersService - Servicio inyectado con lógica de usuarios
   *
   * @description
   * Inyecta UsersService para delegar toda la lógica de negocio.
   * El controlador se mantiene ligero, solo manejando HTTP.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crea un nuevo usuario en el sistema
   *
   * @method create
   * @decorator @Post
   * @decorator @Roles(UserRole.ADMIN)
   * @route POST /users
   * @access ADMIN
   *
   * @param {CreateUserDto} dto - Datos del nuevo usuario (validados)
   * @returns {Promise<User>} Usuario creado (sin contraseña)
   *
   * @description
   * Registra un nuevo usuario con los siguientes pasos:
   * 1. Valida los datos mediante CreateUserDto
   * 2. Normaliza el nombre (trim + mayúsculas)
   * 3. Delega creación al servicio (hash de password + persistencia)
   * 4. Retorna usuario creado (contraseña removida por interceptor)
   *
   * @throws {BadRequestException} Si el email ya está registrado
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   *
   * @security
   * - Solo ADMIN puede crear usuarios
   * - Contraseña hasheada automáticamente por el servicio
   * - Email debe ser único (validado en servicio)
   */
  @Post()
  @Roles(UserRole.ADMIN) // Solo admin puede usar esta ruta
  create(@Body() dto: CreateUserDto) {
    /**
     * Normalización del nombre antes de guardar
     * - trim(): Elimina espacios al inicio y final
     * - toUpperCase(): Convierte a mayúsculas para consistencia
     *
     * Solo se aplica si el campo existe y es string (validación extra)
     */
    if (dto.name && typeof dto.name === 'string') {
      dto.name = dto.name.trim().toUpperCase();
    }
    /**
     * Delega la creación al servicio
     * El servicio se encarga de:
     * - Validar unicidad de email
     * - Hashear la contraseña
     * - Persistir en base de datos
     */
    return this.usersService.create(dto);
  }

  /**
   * Obtiene la lista completa de usuarios
   *
   * @method findAll
   * @decorator @Get
   * @decorator @Roles(UserRole.ADMIN)
   * @route GET /users
   * @access ADMIN
   *
   * @returns {Promise<User[]>} Array de usuarios (sin contraseñas)
   *
   * @description
   * Retorna todos los usuarios registrados en el sistema.
   * Las contraseñas se eliminan automáticamente por SanitizeResponseInterceptor.
   *
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   *
   * @security
   * - Solo ADMIN puede listar usuarios
   * - Contraseñas sanitizadas automáticamente
   */
  @Get()
  @Roles(UserRole.ADMIN) // Solo admin puede usar esta ruta
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Obtiene un usuario específico por su ID
   *
   * @method findOne
   * @decorator @Get(':id')
   * @decorator @Roles(UserRole.ADMIN)
   * @route GET /users/:id
   * @access ADMIN
   *
   * @param {number} id - ID del usuario (parseado y validado)
   * @returns {Promise<User>} Usuario encontrado (sin contraseña)
   *
   * @description
   * Busca un usuario por su identificador único.
   * ParseIntPipeCustom valida que el parámetro sea un número entero válido.
   *
   * @throws {BadRequestException} Si el ID no es un número válido
   * @throws {NotFoundException} Si el usuario no existe
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   *
   * @security
   * - Solo ADMIN puede consultar usuarios
   * - Contraseña sanitizada automáticamente
   */
  @Get(':id')
  @Roles(UserRole.ADMIN) // Solo admin puede usar esta ruta
  findOne(@Param('id', ParseIntPipeCustom) id: number) {
    /**
     * ParseIntPipeCustom se ejecuta antes del método
     * Valida y convierte el parámetro :id a number
     * Lanza BadRequestException si no es un entero válido
     */
    return this.usersService.findOne(id);
  }

  /**
   * Actualiza los datos de un usuario existente
   *
   * @method update
   * @decorator @Put(':id')
   * @decorator @Roles(UserRole.ADMIN)
   * @route PUT /users/:id
   * @access ADMIN
   *
   * @param {number} id - ID del usuario a actualizar
   * @param {UpdateUserDto} dto - Datos a actualizar (parciales)
   * @returns {Promise<object>} Mensaje y datos actualizados del usuario
   *
   * @description
   * Realiza actualización parcial.
   *    * Permite actualizar:
   * - Nombre (normalizado a mayúsculas)
   * - Email (validando unicidad)
   * - Contraseña (hasheada automáticamente)
   * - Rol
   *
   * El mensaje de respuesta varía según si se actualizó la contraseña o no.
   * @throws {BadRequestException} Si no se envían campos en el body
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   *
   * @security
   * - Solo ADMIN puede actualizar usuarios
   * - Nueva contraseña hasheada con bcrypt
   * - Email validado para evitar duplicados
   * - Contraseña nunca se retorna en respuesta
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipeCustom) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    /**
     * Verifica que el body tenga al menos un campo enviado
     */
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    /**
     * Si el body está vacío lanza error 400
     */
    if (!hasAtLeastOneField) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }

    if (dto.name && typeof dto.name === 'string') {
      dto.name = dto.name.trim().toUpperCase();
    }

    /**
     * Delega la actualización al servicio
     * El servicio maneja:
     * - Validación de existencia del usuario
     * - Validación de unicidad de email (si cambió)
     * - Hash de contraseña (si se proporcionó nueva)
     * - Persistencia de cambios
     * - Generación de mensaje contextual
     */
    return this.usersService.update(id, dto);
  }

  /**
   * Elimina un usuario del sistema
   *
   * @method remove
   * @decorator @Delete(':id')
   * @decorator @Roles(UserRole.ADMIN)
   * @route DELETE /users/:id
   * @access ADMIN
   *
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   *
   * @description
   * Elimina permanentemente un usuario de la base de datos.
   * Esta es una operación destructiva e irreversible.
   *
   * @warning
   * - La eliminación es permanente (hard delete)
   * - No se implementa soft delete en este endpoint
   * - Verificar dependencias/relaciones antes de eliminar
   * - Puede fallar si hay restricciones de clave foránea
   *
   * @throws {BadRequestException} Si el ID no es válido
   * @throws {NotFoundException} Si el usuario no existe
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   *
   * @security
   * - Solo ADMIN puede eliminar usuarios
   * - Validación de existencia previa a eliminación
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  remove(@Param('id', ParseIntPipeCustom) id: number) {
    /**
     * ParseIntPipeCustom valida el parámetro :id
     * Delega la eliminación al servicio que:
     * 1. Verifica existencia del usuario
     * 2. Ejecuta DELETE en la base de datos
     * 3. Retorna mensaje de confirmación
     */
    return this.usersService.remove(id);
  }
}
