/**
 * @fileoverview Módulo de gestión de eventos
 * @module EventsModule
 * @description Define y configura el módulo de eventos, incluyendo controlador,
 * servicio y repositorio de TypeORM para la entidad Event. Exporta el servicio
 * para ser utilizado por otros módulos (ej: RegistrationsModule).
 */

/**
 * Module: Decorador que define un módulo de NestJS
 */
import { Module } from '@nestjs/common';
/**
 * Controlador que maneja las rutas HTTP de eventos
 */
import { EventsAppController } from './eventsapp.controller';
/**
 * Servicio con la lógica de negocio de eventos
 */
import { EventsAppService } from './eventsapp.service';
/**
 * TypeOrmModule: Módulo de integración de TypeORM
 */
import { TypeOrmModule } from '@nestjs/typeorm';
/**
 * Entidad Event para operaciones de base de datos
 */
import { Event } from 'src/entities/event.entity';

/**
 * Módulo de eventos
 *
 * @class EventsModule
 * @decorator @Module
 *
 * @description
 * Encapsula toda la funcionalidad relacionada con eventos del sistema:
 * - Controlador: Define endpoints HTTP (GET, POST, PUT, DELETE)
 * - Servicio: Implementa lógica de negocio y operaciones CRUD
 * - Repositorio: Proporciona acceso a la tabla 'event' mediante TypeORM
 *
 * El servicio se exporta para permitir su uso en otros módulos,
 * especialmente en RegistrationsModule para validar eventos al crear inscripciones.
 *
 * **Funcionalidades del módulo**:
 * - Crear y gestionar eventos
 * - Consultar catálogo de eventos
 * - Actualizar información de eventos
 * - Eliminar eventos del sistema
 * - Proporcionar estadísticas (conteo)
 *
 * @property {Array} imports - Módulos importados
 * @property {Array} controllers - Controladores del módulo
 * @property {Array} providers - Servicios disponibles
 * @property {Array} exports - Servicios exportados para otros módulos
 */
@Module({
  /**
   * TypeOrmModule.forFeature()
   * Registra la entidad Event en el contexto de TypeORM
   *
   * @description
   * Permite inyectar Repository<Event> en servicios usando @InjectRepository(Event).
   * TypeORM crea automáticamente el repositorio con métodos CRUD predefinidos.
   *
   * El repositorio proporciona acceso a la tabla 'event' definida en la entidad.
   */
  imports: [TypeOrmModule.forFeature([Event])],
  /**
   * Controladores registrados en el módulo
   *
   * @property {EventsAppController} EventsAppController - Maneja rutas /eventsapp
   *
   * @description
   * EventsAppController define los endpoints
   * Todas las rutas están protegidas por JwtAuthGuard y RolesGuard.
   * El acceso varía según el rol del usuario autenticado.
   */
  controllers: [EventsAppController],
  /**
   * Servicios disponibles en el módulo
   *
   * @property {EventsAppService} EventsAppService - Lógica de negocio de eventos
   *
   * @description
   * EventsAppService implementa operaciones CRUD y consultas:
   *
   * - findAll(): Listado completo de eventos
   * - findOne(): Búsqueda por ID con validación
   * - create(): Creación de eventos con validación de datos
   * - update(): Actualización con verificación de existencia
   * - remove(): Eliminación de eventos
   * - getEventsCount(): Estadística de conteo total
   *
   * El servicio se inyecta en el controlador y puede ser utilizado
   * por otros módulos que importen EventsModule.
   */
  providers: [EventsAppService],
  /**
   * Servicios y módulos exportados para uso en otros módulos
   *
   * @exports {EventsAppService} - Permite inyectar el servicio en otros módulos
   * @exports {TypeOrmModule} - Permite inyectar Repository<Event> en otros módulos
   *
   * @description
   * EventsAppService se exporta principalmente para RegistrationsModule, que necesita:
   * - Validar que un evento existe antes de crear una inscripción
   * - Consultar información de eventos al listar inscripciones
   *
   * TypeOrmModule se exporta para permitir acceso directo al repositorio
   * en módulos que necesiten consultas específicas sin duplicar lógica.
   */
  exports: [EventsAppService, TypeOrmModule],
})
export class EventsModule {}
