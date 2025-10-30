/**
 * @fileoverview Servicio de gestión de inscripciones a eventos
 * @module RegistrationsService
 * @description Implementa la lógica de negocio para relacionar usuarios con eventos
 * mediante inscripciones (registrations). Gestiona operaciones CRUD con validaciones
 * de existencia de entidades relacionadas y permisos según roles de usuario.
 */

/**
 * Injectable: Marca la clase como proveedor inyectable
 * NotFoundException: Excepción HTTP 404 para recursos no encontrados
 */
import { Injectable, NotFoundException } from '@nestjs/common';
/**
 * InjectRepository: Decorador para inyectar repositorios de TypeORM
 */
import { InjectRepository } from '@nestjs/typeorm';
/**
 * Repository: Clase base de TypeORM para operaciones de base de datos
 */
import { Repository } from 'typeorm';
/**
 * Entidades del dominio que representan las tablas de la base de datos
 */
import { EventRegistration } from 'src/entities/event-registration.entity';
import { User } from 'src/entities/user.entity';
import { Event } from 'src/entities/event.entity';
/**
 * DTOs para validación de datos de entrada
 */
import { CreateRegistrationDTO } from 'src/dto/create-registration.dto';
import { UpdateRegistrationDTO } from 'src/dto/update-registration.dto';

/**
 * Enum que define los roles del sistema (ADMIN, ORGANIZER, ATTENDEE)
 */
import { UserRole } from 'src/entities/user.entity';

/**
 * Servicio de gestión de inscripciones a eventos
 * 
 * @class RegistrationsService
 * @decorator @Injectable
 * 
 * @description
 * Maneja la relación many-to-many entre usuarios y eventos mediante
 * la entidad EventRegistration. Proporciona funcionalidades para:
 * - Inscribir usuarios a eventos con validaciones
 * - Consultar inscripciones (con filtrado por rol)
 * - Actualizar inscripciones existentes
 * - Cancelar inscripciones
 * 
 * Características especiales:
 * - Los usuarios ATTENDEE solo ven sus propias inscripciones
 * - ADMIN y ORGANIZER pueden ver todas las inscripciones
 * - Validación de existencia de usuarios y eventos antes de crear relaciones
 */
@Injectable()
export class RegistrationsService {
  /**
   * Constructor del servicio
   * 
   * @constructor
   * @param {Repository<EventRegistration>} registrationRepo - Repositorio de inscripciones
   * @param {Repository<User>} userRepo - Repositorio de usuarios
   * @param {Repository<Event>} eventRepo - Repositorio de eventos
   * 
   * @description
   * Inyecta tres repositorios para gestionar:
   * 1. EventRegistration: Tabla principal de inscripciones (relación)
   * 2. User: Para validar existencia de usuarios
   * 3. Event: Para validar existencia de eventos
   * 
   * Esta arquitectura permite validar integridad referencial antes de
   * crear o actualizar inscripciones.
   */
  constructor(
    @InjectRepository(EventRegistration)
    private registrationRepo: Repository<EventRegistration>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  /**
   * Crea una nueva inscripción de usuario a evento
   * 
   * @async
   * @method create
   * @param {CreateRegistrationDTO} dto - Datos de la inscripción (userId, eventId)
   * @returns {Promise<EventRegistration>} Inscripción creada con relaciones cargadas
   * @throws {NotFoundException} Si el usuario o evento no existen
   * 
   * @description
   * Proceso de creación:
   * 1. Valida que el usuario existe en la base de datos
   * 2. Valida que el evento existe en la base de datos
   * 3. Crea la relación entre usuario y evento
   * 4. Persiste la inscripción
   * 
   * @security
   * - Previene inscripciones con IDs inexistentes
   * - Validación previa evita errores de integridad referencial
   */
  async create(dto: CreateRegistrationDTO) {
    /**
     * Búsqueda del usuario por ID
     * findOne() retorna null si no existe
     */
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    /**
     * Búsqueda del evento por ID
     * findOne() retorna null si no existe
     */
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    /**
     * Validación de existencia del usuario
     * Lanza excepción HTTP 404 si no se encuentra
     */
    if (!user)
      throw new NotFoundException(
        `Usuario con ID ${dto.userId} no encontrado.`,
      );
    /**
     * Validación de existencia del evento
     * Lanza excepción HTTP 404 si no se encuentra
     */
    if (!event)
      throw new NotFoundException(
        `Evento con ID ${dto.eventId} no encontrado.`,
      );
    /**
     * Creación de la instancia de inscripción
     * create() no persiste, solo crea el objeto en memoria
     * Se pasan las entidades completas, no solo los IDs
     */
    const registration = this.registrationRepo.create({ user, event });
    /**
     * Persistencia de la inscripción en base de datos
     * save() ejecuta INSERT y retorna la entidad con ID generado
     */
    return this.registrationRepo.save(registration);
  }

  /**
   * Obtiene inscripciones según el rol del usuario autenticado
   * 
   * @async
   * @method findAll
   * @param {Object} user - Datos del usuario autenticado
   * @param {number} user.userId - ID del usuario autenticado
   * @param {UserRole} user.role - Rol del usuario (ADMIN, ORGANIZER, ATTENDEE)
   * @returns {Promise<EventRegistration[]>} Lista de inscripciones
   * 
   * @description
   * Implementa lógica de filtrado basada en roles:
   * 
   * **ATTENDEE**: Solo ve sus propias inscripciones
   * - Filtra por user.id = userId autenticado
   * - Útil para que usuarios normales vean sus eventos
   * 
   * **ADMIN/ORGANIZER**: Ven todas las inscripciones del sistema
   * - Sin filtros, acceso completo
   * - Útil para gestión y reportes
   * 
   * Características comunes:
   * - Carga relaciones 'user' y 'event' (eager loading)
   * - Ordenamiento por ID ascendente para consistencia
   * 
   * @security
   * - Aislamiento de datos por rol
   * - ATTENDEE no puede ver inscripciones de otros usuarios
   */
  async findAll(user: { userId: number; role: UserRole }) {
    /**
     * Lógica condicional según rol
     */
    if (user.role === UserRole.ATTENDEE) {
      /**
       * Query filtrada para ATTENDEE
       * WHERE user.id = :userId
       * Incluye relaciones user y event
       * Ordenado por ID ascendente
       */
      return this.registrationRepo.find({
        where: { user: { id: user.userId } },
        relations: ['user', 'event'],
        order: { id: 'ASC' },
      });
    } else {
      /**
       * Query sin filtros para ADMIN y ORGANIZER
       * SELECT * FROM event_registration
       * Incluye relaciones user y event
       * Ordenado por ID ascendente
       */
      return this.registrationRepo.find({
        relations: ['user', 'event'],
        order: { id: 'ASC' },
      });
    }
  }

  /**
   * Busca una inscripción específica por su ID
   * 
   * @async
   * @method findOne
   * @param {number} id - ID de la inscripción
   * @returns {Promise<EventRegistration>} Inscripción con relaciones cargadas
   * @throws {NotFoundException} Si la inscripción no existe
   * 
   * @description
   * Obtiene una inscripción específica incluyendo datos completos
   * del usuario y evento relacionados mediante eager loading.
   * 
   * @security
   * No implementa filtrado por rol. El controlador debe validar
   * que el usuario tenga permisos para acceder a esta inscripción.
   */
  async findOne(id: number) {
    /**
     * Búsqueda con relaciones cargadas
     * findOne() con relations carga user y event en una sola query
     */
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    /**
     * Validación de existencia
     * Lanza NotFoundException si no se encuentra
     */
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    return registration;
  }

  /**
   * Actualiza una inscripción existente
   * 
   * @async
   * @method update
   * @param {number} id - ID de la inscripción a actualizar
   * @param {UpdateRegistrationDTO} dto - Datos a actualizar (userId, eventId)
   * @returns {Promise<EventRegistration>} Inscripción actualizada
   * @throws {NotFoundException} Si la inscripción, usuario o evento no existen
   * 
   * @description
   * Permite cambiar el usuario o evento de una inscripción existente.
   * Casos de uso:
   * - Transferir una inscripción a otro usuario
   * - Cambiar el evento de una inscripción
   * - Actualizar ambos simultáneamente
   * 
   * Proceso:
   * 1. Verifica que la inscripción existe
   * 2. Si hay nuevo userId, valida que el usuario existe
   * 3. Si hay nuevo eventId, valida que el evento existe
   * 4. Actualiza las relaciones
   * 5. Persiste cambios
   */
  async update(id: number, dto: UpdateRegistrationDTO) {
    /**
     * Búsqueda de la inscripción existente con relaciones
     * Necesario cargar relaciones para retornar datos completos
     */
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    /**
     * Validación de existencia de la inscripción
     */
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    /**
     * Actualización condicional del usuario
     * Solo si dto.userId está presente
     */
    if (dto.userId) {
      /**
       * Búsqueda del nuevo usuario
       */
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      /**
       * Validación de existencia del usuario
       */
      if (!user)
        throw new NotFoundException(
          `Usuario con ID ${dto.userId} no encontrado.`,
        );
      /**
       * Asignación de la nueva relación
       */
      registration.user = user;
    }
    /**
     * Actualización condicional del evento
     * Solo si dto.eventId está presente
     */
    if (dto.eventId) {
       /**
       * Búsqueda del nuevo evento
       */
      const event = await this.eventRepo.findOne({
        where: { id: dto.eventId },
      });
      /**
       * Validación de existencia del evento
       */
      if (!event)
        throw new NotFoundException(
          `Evento con ID ${dto.eventId} no encontrado.`,
        );
      /**
       * Asignación de la nueva relación
       */
      registration.event = event;
    }
    /**
     * Persistencia de cambios en base de datos
     * save() ejecuta UPDATE y retorna la entidad actualizada
     */
    return this.registrationRepo.save(registration);
  }

  /**
   * Elimina una inscripción del sistema
   * 
   * @async
   * @method remove
   * @param {number} id - ID de la inscripción a eliminar
   * @returns {Promise<EventRegistration>} Inscripción eliminada (con datos completos)
   * @throws {NotFoundException} Si la inscripción no existe
   * 
   * @description
   * Cancela una inscripción eliminándola de la base de datos.
   * Retorna los datos completos de la inscripción eliminada
   * para confirmación o logging.
   * 
   */
  async remove(id: number) {
    /**
     * Búsqueda de la inscripción con relaciones
     * Necesario para retornar datos completos y para validación
     */
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    /**
     * Validación de existencia
     */
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    /**
     * Eliminación física del registro
     * delete() ejecuta DELETE FROM event_registration WHERE id = ?
     * 
     * Nota: Se usa delete() en lugar de remove() para mejor rendimiento
     * cuando no se necesitan hooks de entidad
     */
    await this.registrationRepo.delete(id);
    /**
     * Retorna la inscripción eliminada con datos completos
     * Útil para logging, confirmación o deshacer acción
     */
    return registration;
  }
}
