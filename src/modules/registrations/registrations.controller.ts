/**
 * @fileoverview Controlador de inscripciones a eventos
 * @module RegistrationsController
 * @description Maneja las solicitudes HTTP para gestionar inscripciones de usuarios
 * a eventos. Implementa control de acceso basado en roles con permisos diferenciados:
 * - ATTENDEE: Solo consulta sus propias inscripciones
 * - ORGANIZER: Gestiona inscripciones (crear, actualizar, consultar)
 * - ADMIN: Control total incluyendo eliminación
 */

/**
 * Decoradores de NestJS para definir controladores y rutas HTTP
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
/**
 * Servicio con la lógica de negocio de inscripciones
 */
import { RegistrationsService } from './registrations.service';
/**
 * DTOs para validación de datos de entrada
 */
import { CreateRegistrationDTO } from 'src/dto/create-registration.dto';
import { UpdateRegistrationDTO } from 'src/dto/update-registration.dto';

/**
 * Guards para autenticación y autorización
 */
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';

/**
 * Pipe personalizado para validación de parámetros enteros
 */
import { ParseIntPipeCustom } from 'src/common/pipes/parse-int.pipe';
/**
 * Filtro para manejo de excepciones HTTP
 */
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
/**
 * Interceptor para sanitización de respuestas
 */
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

/**
 * Controlador de inscripciones a eventos
 * 
 * @class RegistrationsController
 * @decorator @Controller('registrations')
 * 
 * @description
 * Gestiona operaciones CRUD para inscripciones usuario-evento.
 * Prefijo de ruta: /registrations
 * 
 * Seguridad multi-nivel:
 * - JwtAuthGuard: Requiere autenticación con token JWT
 * - RolesGuard: Valida roles específicos por endpoint
 * - HttpExceptionFilter: Formatea errores consistentemente
 * - SanitizeResponseInterceptor: Elimina datos sensibles
 */
@UseFilters(HttpExceptionFilter) // filtro global de excepciones
@UseInterceptors(SanitizeResponseInterceptor) // Interceptor para formatear respuestas y eliminar datos sensibles
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas del controlador
@Controller('registrations') // Define el prefijo de las rutas que pertenecen a este controlador
export class RegistrationsController {
  /**
   * Constructor del controlador
   * 
   * @constructor
   * @param {RegistrationsService} registrationsService - Servicio inyectado
   * 
   * @description
   * Inyecta el servicio de inscripciones para delegar lógica de negocio.
   */
  constructor(private readonly registrationsService: RegistrationsService) {}

  /**
   * Crea una nueva inscripción de usuario a evento
   * 
   * @method create
   * @decorator @Post
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
   * @route POST /registrations
   * @access ADMIN, ORGANIZER
   * 
   * @param {CreateRegistrationDTO} dto - Datos de la inscripción
   * @returns {Promise<EventRegistration>} Inscripción creada
   * 
   * @description
   * Registra un usuario en un evento creando una relación en la tabla
   * event_registration. Valida que tanto el usuario como el evento existan.
   * 
   * @throws {BadRequestException} Si los datos del DTO son inválidos
   * @throws {NotFoundException} Si el usuario o evento no existen
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN ni ORGANIZER
   * 
   * @security
   * - Solo ADMIN y ORGANIZER pueden inscribir usuarios
   * - ATTENDEE no puede usar este endpoint (debe autoregistrarse en un endpoint específico)
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer pueden usar esta ruta
  create(@Body() dto: CreateRegistrationDTO) {
    /**
     * Delega la creación al servicio que:
     * 1. Valida existencia de usuario y evento
     * 2. Crea la relación
     * 3. Persiste en base de datos
     */
    return this.registrationsService.create(dto);
  }

  /**
   * Obtiene inscripciones según el rol del usuario autenticado
   * 
   * @method findAll
   * @decorator @Get
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE)
   * @route GET /registrations
   * @access ALL ROLES
   * 
   * @param {Request} req - Objeto de request con datos del usuario autenticado
   * @param {Object} req.user - Datos del usuario del token JWT
   * @param {number} req.user.userId - ID del usuario autenticado
   * @param {UserRole} req.user.role - Rol del usuario
   * @returns {Promise<EventRegistration[]>} Lista de inscripciones
   * 
   * @description
   * Endpoint con lógica de filtrado basada en roles:
   * 
   * **ATTENDEE**:
   * - Solo ve sus propias inscripciones
   * - Útil para "Mis Eventos" en interfaz de usuario
   * 
   * **ORGANIZER**:
   * - Ve todas las inscripciones del sistema
   * - Útil para gestión de eventos y reportes
   * 
   * **ADMIN**:
   * - Ve todas las inscripciones del sistema
   * - Control total para administración
   * 
   * @security
   * - Filtrado automático por rol en el servicio
   * - ATTENDEE no puede ver inscripciones de otros usuarios
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE) // todos los roles tienen acceso
  findAll(@Request() req: { user: { userId: number; role: UserRole } }) {
    /**
     * Extrae userId y role del token JWT decodificado
     * JwtAuthGuard ya validó el token y agregó req.user
     * 
     * El servicio usa estos datos para aplicar filtros según rol:
     * - ATTENDEE: WHERE user.id = req.user.userId
     * - ADMIN/ORGANIZER: Sin filtros (todas las inscripciones)
     */
    return this.registrationsService.findAll(req.user);
  }

  /**
   * Obtiene una inscripción específica por su ID
   * 
   * @method findOne
   * @decorator @Get(':id')
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
   * @route GET /registrations/:id
   * @access ADMIN, ORGANIZER
   * 
   * @param {number} id - ID de la inscripción (validado por ParseIntPipeCustom)
   * @returns {Promise<EventRegistration>} Inscripción con relaciones
   * 
   * @description
   * Retorna los detalles completos de una inscripción incluyendo
   * información del usuario y evento relacionados.
   * 
   * @throws {BadRequestException} Si el ID no es un número válido
   * @throws {NotFoundException} Si la inscripción no existe
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN ni ORGANIZER
   * 
   * @security
   * - Solo ADMIN y ORGANIZER tienen acceso
   * - ATTENDEE no puede acceder (usarían GET / que filtra automáticamente)
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer pueden usar esta ruta
  findOne(@Param('id', ParseIntPipeCustom) id: number) {
    /**
     * ParseIntPipeCustom valida y convierte el parámetro :id
     * Delega la búsqueda al servicio
     */
    return this.registrationsService.findOne(id);
  }

  /**
   * Actualiza una inscripción existente
   * 
   * @method update
   * @decorator @Put(':id')
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
   * @route PUT /registrations/:id
   * @access ADMIN, ORGANIZER
   * 
   * @param {number} id - ID de la inscripción a actualizar
   * @param {UpdateRegistrationDTO} dto - Datos a actualizar
   * @returns {Promise<EventRegistration>} Inscripción actualizada
   * 
   * @description
   * Permite modificar una inscripción existente cambiando:
   * - El usuario inscrito (transferir inscripción)
   * - El evento al que está inscrito
   * - Ambos simultáneamente
   * 
   * Casos de uso:
   * - Transferir inscripción a otro usuario
   * - Reasignar usuario a otro evento
   * - Corregir errores de registro
   * 
   * @throws {BadRequestException} Si el ID o datos del DTO son inválidos
   * @throws {NotFoundException} Si inscripción, usuario o evento no existen
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN ni ORGANIZER
   * 
   * @security
   * - Solo ADMIN y ORGANIZER pueden actualizar inscripciones
   * - Validación de existencia de entidades relacionadas
   */
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer usar esta ruta
  update(
    @Param('id', ParseIntPipeCustom) id: number,
    @Body() dto: UpdateRegistrationDTO,
  ) {
    /**
     * ParseIntPipeCustom valida el parámetro :id
     * UpdateRegistrationDTO valida el cuerpo de la petición
     * 
     * El servicio se encarga de:
     * 1. Validar existencia de la inscripción
     * 2. Si hay userId, validar existencia del usuario
     * 3. Si hay eventId, validar existencia del evento
     * 4. Actualizar las relaciones
     * 5. Persistir cambios
     */
    return this.registrationsService.update(id, dto);
  }

  /**
   * Elimina una inscripción del sistema
   * 
   * @method remove
   * @decorator @Delete(':id')
   * @decorator @Roles(UserRole.ADMIN)
   * @route DELETE /registrations/:id
   * @access ADMIN ONLY
   * 
   * @param {number} id - ID de la inscripción a eliminar
   * @returns {Promise<EventRegistration>} Inscripción eliminada (para confirmación)
   * 
   * @description
   * Cancela una inscripción eliminándola permanentemente de la base de datos.
   * Retorna los datos completos de la inscripción eliminada para
   * confirmación o logging.
   * 
   * @throws {BadRequestException} Si el ID no es válido
   * @throws {NotFoundException} Si la inscripción no existe
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   * 
   * @security
   * - **SOLO ADMIN** puede eliminar inscripciones
   * - ORGANIZER NO tiene permiso de eliminación
   * - ATTENDEE NO tiene permiso de eliminación
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN) // Solo admin puede usar esta ruta
  remove(@Param('id', ParseIntPipeCustom) id: number) {
    /**
     * ParseIntPipeCustom valida el parámetro :id
     * 
     * El servicio:
     * 1. Verifica existencia de la inscripción
     * 2. Ejecuta DELETE físico en base de datos
     * 3. Retorna la inscripción eliminada con datos completos
     */
    return this.registrationsService.remove(id);
  }
}
