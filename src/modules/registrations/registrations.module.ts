/**
 * @fileoverview Módulo de gestión de inscripciones a eventos
 * @module RegistrationsModule
 * @description Define y configura el módulo de inscripciones que conecta
 * usuarios con eventos. Integra los módulos de Users y Events para gestionar
 * la relación many-to-many mediante la entidad EventRegistration.
 */

/**
 * Module: Decorador que define un módulo de NestJS
 */
import { Module } from '@nestjs/common';
/**
 * Controlador que maneja las rutas HTTP de inscripciones
 */
import { RegistrationsController } from './registrations.controller';
/**
 * Servicio con la lógica de negocio de inscripciones
 */
import { RegistrationsService } from './registrations.service';
/**
 * Módulos relacionados que exportan servicios necesarios
 */
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../eventsapp/eventsapp.module';
/**
 * TypeOrmModule: Módulo de integración de TypeORM
 */
import { TypeOrmModule } from '@nestjs/typeorm';
/**
 * Entidad EventRegistration para operaciones de base de datos
 */
import { EventRegistration } from 'src/entities/event-registration.entity';

/**
 * Módulo de inscripciones a eventos
 * 
 * @class RegistrationsModule
 * @decorator @Module
 * 
 * @description
 * Módulo que gestiona la relación many-to-many entre usuarios y eventos.
 * 
 */
@Module({
  /**
   * Módulos y entidades importados
   */
  imports: [
    /**
     * Registra EventRegistration para operaciones de base de datos
     * Tabla: event_registration (relación many-to-many)
     */
    TypeOrmModule.forFeature([EventRegistration]),
    /**
     * Módulo de usuarios (exporta Repository<User>)
     * Necesario para:
     * - Validar que userId existe antes de crear inscripción
     * - Actualizar usuario en una inscripción existente
     * - Cargar datos del usuario en las relaciones
     */
    UsersModule,
    /**
     * Módulo de eventos (exporta Repository<Event>)
     * Necesario para:
     * - Validar que eventId existe antes de crear inscripción
     * - Actualizar evento en una inscripción existente
     * - Cargar datos del evento en las relaciones
     */
    EventsModule,
  ],
  /**
   * Controladores registrados en el módulo
   * 
   * @property {RegistrationsController} RegistrationsController
   * 
   * @description
   * Maneja rutas /registrations con endpoints:
   * Todas las rutas protegidas con JwtAuthGuard y RolesGuard
   */
  controllers: [RegistrationsController],
  /**
   * Servicios disponibles en el módulo
   * 
   * @property {RegistrationsService} RegistrationsService
   * 
   * @description
   * Implementa la lógica de negocio de inscripciones:
   * 
   * - create(): Crea inscripción validando usuario y evento
   * - findAll(): Lista inscripciones con filtrado por rol
   * - findOne(): Busca inscripción por ID con relaciones
   * - update(): Actualiza usuario o evento de una inscripción
   * - remove(): Elimina inscripción permanentemente
   * 
   * Características especiales:
   * - Validación de integridad referencial
   * - Filtrado automático para ATTENDEE (solo sus inscripciones)
   * - Eager loading de relaciones user y event
   */
  providers: [RegistrationsService],
})
export class RegistrationsModule {}
