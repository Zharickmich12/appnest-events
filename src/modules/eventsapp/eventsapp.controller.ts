/**
 * @fileoverview Controlador de eventos
 * @module EventsAppController
 * @description Maneja las solicitudes HTTP relacionadas con la gestión de eventos.
 * Define endpoints CRUD protegidos con autenticación JWT y autorización basada en roles.
 * Los permisos varían según la operación: consultas públicas para todos los roles,
 * gestión para ADMIN y ORGANIZER.
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
  Param,
  Body,
  UseGuards,
  UseFilters,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

// Se importan los guards y decoradores para la protección de rutas
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';

// Se importan el filtro e interceptor globales.
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

// Se importa el pipe personalizado
import { ParseIntPipeCustom } from 'src/common/pipes/parse-int.pipe';

// Se importa el servicio de eventos
import { EventsAppService } from './eventsapp.service';

// Se importan los DTOs que permiten validar los datos de entrada.
import { CreateEventDTO } from 'src/dto/create-event.dto';
import { UpdateEventDTO } from 'src/dto/update-event.dto';

/**
 * Importaciones Swagger
 * Permiten documentar los endpoints de eventos en Swagger UI.
 */
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse 
} from '@nestjs/swagger';

/**
 * Controlador de eventos
 *
 * @class EventsAppController
 * @decorator @Controller('eventsapp')
 *
 * @description
 * Gestiona todas las operaciones CRUD para eventos del sistema.
 * Prefijo de ruta: /eventsapp
 *
 * Seguridad aplicada:
 * - JwtAuthGuard: Requiere token JWT válido en todas las rutas
 * - RolesGuard: Valida roles específicos por endpoint
 * - HttpExceptionFilter: Formatea errores HTTP consistentemente
 * - SanitizeResponseInterceptor: Limpia datos sensibles de respuestas
 */
@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('/api/eventsapp')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas con autenticación y roles
@UseFilters(HttpExceptionFilter) // Aplica el filtro global de excepciones.
@UseInterceptors(SanitizeResponseInterceptor) // Interceptor para formatear respuestas y eliminar datos sensibles
export class EventsAppController {
  /**
   * Constructor del controlador
   *
   * @constructor
   * @param {EventsAppService} eventsAppService - Servicio inyectado
   *
   * @description
   * Inyecta el servicio de eventos para delegar lógica de negocio.
   */
  constructor(private readonly eventsAppService: EventsAppService) {}

  /**
   * Obtiene la lista completa de eventos con conteo total
   *
   * @method getEvents
   * @decorator @Get
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE)
   * @route GET /eventsapp
   * @access ALL ROLES
   *
   * @returns {Promise<object>} Objeto con mensaje, total y datos de eventos
   *
   * @description
   * Endpoint público (autenticado) que retorna todos los eventos del sistema
   * junto con el conteo total. Útil para mostrar catálogo de eventos disponibles.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE) // todos los roles tienen acceso
  @ApiOperation({
    summary: 'Obtener todos los eventos',
    description: 'Retorna una lista de todos los eventos con su conteo total.',
  })
  @ApiResponse({ status: 200, description: 'Lista de eventos obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Token JWT faltante o inválido.' })
  async getEvents() {
    const events = await this.eventsAppService.findAll(); // Obtiene la lista completa de los eventos
    const count = await this.eventsAppService.getEventsCount(); // Cuenta el total de eventos
    /**
     * Retorna objeto estructurado con:
     * - message: Descripción de la operación
     * - total: Número total de eventos
     * - data: Array con todos los eventos
     */
    return {
      message: 'Lista de eventos obtenida',
      total: count,
      data: events,
    };
  }

  /**
   * Obtiene un evento específico por su ID
   *
   * @method getEventById
   * @decorator @Get(':id')
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE)
   * @route GET /eventsapp/:id
   * @access ALL ROLES
   *
   * @param {number} id - ID del evento (validado por ParseIntPipeCustom)
   * @returns {Promise<object>} Objeto con mensaje y datos del evento
   *
   * @description
   * Retorna los detalles completos de un evento específico.
   * Endpoint público (autenticado) accesible por todos los roles.
   *
   * @throws {BadRequestException} Si el ID no es un número válido
   * @throws {NotFoundException} Si el evento no existe
   * @throws {UnauthorizedException} Si no hay token JWT válido
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE) // todos los roles tienen acceso
  @ApiOperation({
    summary: 'Obtener evento por ID',
    description: 'Devuelve los detalles de un evento específico mediante su ID.',
  })
  @ApiResponse({ status: 200, description: 'Evento encontrado correctamente.' })
  @ApiResponse({ status: 400, description: 'El ID proporcionado no es válido.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  async getEventById(@Param('id', ParseIntPipeCustom) id: number) {
    const event = await this.eventsAppService.findOne(id); // Busca el evento por su id
    /**
     * Retorna objeto estructurado con mensaje y datos del evento
     */
    return { message: 'Evento encontrado', event };
  }

  /**
   * Crea un nuevo evento en el sistema
   *
   * @method create
   * @decorator @Post
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
   * @route POST /eventsapp
   * @access ADMIN, ORGANIZER
   *
   * @param {CreateEventDTO} dto - Datos del nuevo evento (validados)
   * @returns {Promise<Event>} Evento creado con ID generado
   *
   * @description
   * Permite a ADMIN y ORGANIZER crear nuevos eventos en el sistema.
   * Los datos son validados mediante CreateEventDTO antes de persistir.
   *
   * @throws {BadRequestException} Si los datos del DTO son inválidos
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario es ATTENDEE
   *
   * @security
   * - Solo ADMIN y ORGANIZER pueden crear eventos
   * - ATTENDEE no tiene permiso (debe solicitar a un organizador)
   * - Validaciones de DTO previenen datos malformados
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer pueden crear
  @ApiOperation({
    summary: 'Crear un nuevo evento',
    description: 'Permite a ADMIN y ORGANIZER crear un evento con datos validados.',
  })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o faltantes en la solicitud.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado. Rol no autorizado.' })
  async create(@Body() dto: CreateEventDTO) {
    /**
     * Delega la creación al servicio que:
     * 1. Crea instancia de Event
     * 2. Persiste en base de datos
     * 3. Retorna evento con ID generado
     */
    return await this.eventsAppService.create(dto);
  }

  /**
   * Actualiza los datos de un evento existente
   *
   * @method update
   * @decorator @Put(':id')
   * @decorator @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
   * @route PUT /eventsapp/:id
   * @access ADMIN, ORGANIZER
   *
   * @param {number} id - ID del evento a actualizar
   * @param {UpdateEventDTO} dto - Datos parciales para actualizar
   * @returns {Promise<object>} Objeto con mensaje y evento actualizado
   *
   * @description
   * Permite actualizar uno o varios campos del evento.
   * Soporta actualización parcial.

   *
   * @throws {BadRequestException} Si se envía PUT vacío o datos inválidos
   * @throws {NotFoundException} Si el evento no existe
   * @throws {UnauthorizedException} Si no hay token JWT
   * @throws {ForbiddenException} Si el rol del usuario no es ADMIN/ORGANIZER
   *
   * @security
   * Solo ADMIN y ORGANIZER pueden modificar eventos
   */
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Actualizar evento',
    description: 'Permite a ADMIN y ORGANIZER modificar la información de un evento existente.',
  })
  @ApiResponse({ status: 200, description: 'Evento actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Debe enviar al menos un campo válido para actualizar.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  async update(
    @Param('id', ParseIntPipeCustom) id: number,
    @Body() dto: UpdateEventDTO,
  ) {
    /**
     * Verifica que el DTO tenga al menos 1 campo enviado.
     * Object.values(dto) → inspecciona solo los campos definidos
     */
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    /**
     * Si el PUT está vacío (ej: {}) => error 400
     */
    if (!hasAtLeastOneField) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }

    /**
     * Delegación al servicio:
     * - Verifica existencia
     * - Ejecuta update
     * - Retorna evento actualizado
     */
    return this.eventsAppService.update(id, dto);
  }

  /**
   * Elimina un evento del sistema
   *
   * @method remove
   * @decorator @Delete(':id')
   * @decorator @Roles(UserRole.ADMIN)
   * @route DELETE /eventsapp/:id
   * @access ADMIN ONLY
   *
   * @param {number} id - ID del evento a eliminar
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   *
   * @description
   * Elimina permanentemente un evento de la base de datos.
   * Esta es una operación destructiva e irreversible.
   *
   * @throws {BadRequestException} Si el ID no es válido
   * @throws {NotFoundException} Si el evento no existe
   * @throws {UnauthorizedException} Si no hay token JWT válido
   * @throws {ForbiddenException} Si el usuario no es ADMIN
   *
   * @security
   * - **EXCLUSIVO PARA ADMIN** (máximo nivel de privilegio)
   *
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN) // Solo admin puede eliminar
  @ApiOperation({
    summary: 'Eliminar evento',
    description: 'Elimina un evento por ID. Solo ADMIN tiene permiso para esta acción.',
  })
  @ApiResponse({ status: 200, description: 'Evento eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN puede eliminar eventos.' })
  async remove(@Param('id', ParseIntPipeCustom) id: number) {
    /**
     * ParseIntPipeCustom valida el parámetro :id
     *
     * El servicio:
     * 1. Verifica existencia del evento
     * 2. Ejecuta DELETE físico en base de datos
     * 3. Retorna mensaje con ID y título del evento eliminado
     */
    return await this.eventsAppService.remove(id);
  }
}
