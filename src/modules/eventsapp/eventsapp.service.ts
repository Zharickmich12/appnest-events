/**
 * @fileoverview Servicio de gestión de eventos
 * @module EventsAppService
 * @description Implementa la lógica de negocio y operaciones CRUD para la entidad Event.
 * Gestiona eventos del sistema incluyendo creación, consulta, actualización, eliminación
 * y estadísticas básicas como conteo total de eventos.
 */

/**
 * Injectable: Marca la clase como proveedor inyectable
 * NotFoundException: Excepción HTTP 404 para recursos no encontrados
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
/**
 * InjectRepository: Decorador para inyectar repositorios de TypeORM
 */
import { InjectRepository } from '@nestjs/typeorm';
/**
 * Repository: Clase base de TypeORM para operaciones de base de datos
 */
import { Repository } from 'typeorm';
/**
 * Entidad Event que representa la tabla de eventos en la base de datos
 */
import { Event } from 'src/entities/event.entity';
/**
 * DTOs para validación de datos de entrada
 */
import { CreateEventDTO } from 'src/dto/create-event.dto';
import { UpdateEventDTO } from 'src/dto/update-event.dto';

/**
 * Servicio de gestión de eventos
 *
 * @class EventsAppService
 * @decorator @Injectable
 *
 * @description
 * Proporciona métodos para administrar eventos del sistema
 */
@Injectable()
export class EventsAppService {
  /**
   * Constructor del servicio
   *
   * @constructor
   * @param {Repository<Event>} eventRepository - Repositorio de TypeORM para Event
   *
   * @description
   * Inyecta el repositorio de Event para realizar operaciones de base de datos.
   * TypeORM proporciona métodos predefinidos (find, findOne, save, update, delete, count)
   */
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  /**
   * Obtiene todos los eventos registrados en el sistema
   *
   * @method findAll
   * @returns {Promise<Event[]>} Array con todos los eventos
   *
   * @description
   * Retorna la lista completa de eventos
   */
  findAll() {
    /**
     * find() sin parámetros retorna todos los registros
     * Equivalente a: SELECT * FROM event
     * Ordenamiento por defecto según la base de datos (usualmente por ID)
     */
    return this.eventRepository.find();
  }

  /**
   * Busca un evento específico por su ID
   *
   * @async
   * @method findOne
   * @param {number} id - ID del evento a buscar
   * @returns {Promise<Event>} Evento encontrado
   * @throws {NotFoundException} Si el evento no existe
   *
   * @description
   * Método utilizado internamente por update() y remove().
   * Lanza excepción si no se encuentra el evento para evitar operaciones inválidas.
   *
   * @security
   * El controlador debe validar
   * que el usuario tenga permisos para acceder al evento.
   */
  async findOne(id: number) {
    /**
     * findOne() busca un registro por criterios específicos
     * Equivalente a: SELECT * FROM event WHERE id = ?
     */
    const event = await this.eventRepository.findOne({ where: { id } });
    /**
     * Si no se encuentra el evento, lanza excepción HTTP 404
     * Mensaje descriptivo para facilitar debugging
     */
    if (!event)
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    return event;
  }

  /**
   * Crea un nuevo evento en la base de datos
   *
   * @async
   * @method create
   * @param {CreateEventDTO} data - Datos del nuevo evento (validados por DTO)
   * @returns {Promise<Event>} Evento creado con ID generado
   *
   * @description
   * Proceso de creación:
   * 1. Valida datos mediante CreateEventDTO (validadores class-validator)
   * 2. Verifica que NO exista otro evento con el mismo título
   *    (títulos duplicados no están permitidos)
   * 3. Crea instancia de la entidad Event
   * 4. Persiste en base de datos
   * 5. Retorna evento creado con ID auto-generado
   *
   * @throws {BadRequestException} Si ya existe un evento con el mismo título
   *
   * @security
   * - evita duplicados y protege integridad lógica de la tabla de eventos
   */
  async create(data: CreateEventDTO) {
    /**
     * Verifica si ya existe un evento con el mismo título
     * findOne() busca registros por criterio específico
     * Equivalente a: SELECT * FROM event WHERE title = ?
     */
    const existing = await this.eventRepository.findOne({
      where: { title: data.title },
    });

    /**
     * Si existe, se lanza excepción HTTP 400
     * Evita conflictos y duplicidad de nombres de eventos
     */
    if (existing) {
      throw new BadRequestException(
        `Ya existe un evento con el título "${data.title}". No se permiten títulos duplicados.`,
      );
    }

    /**
     * create() crea instancia del Event
     * no persiste en BD aún, solo crea estructura en memoria
     */
    const newEvent = this.eventRepository.create(data);

    /**
     * save() persiste el registro en la base de datos
     * ejecuta INSERT y retorna la entidad con el ID generado
     */
    return await this.eventRepository.save(newEvent);
  }

  /**
   * Actualiza los datos de un evento existente
   *
   * @async
   * @method update
   * @param {number} id - ID del evento a actualizar
   * @param {UpdateEventDTO} data - Datos a actualizar (parciales)
   * @returns {Promise<object>} Objeto con mensaje y evento actualizado
   * @throws {NotFoundException} Si el evento no existe
   *
   * @description
   * Proceso de actualización:
   * 1. Verifica que el evento existe (findOne lanza NotFoundException si no existe)
   * 2. Ejecuta actualización en base de datos
   * 3. Recupera el evento actualizado
   * 4. Retorna mensaje con título del evento y datos actualizados
   *
   * @validation
   * UpdateEventDTO permite actualización parcial:
   * - Todos los campos son opcionales
   * - Solo se actualizan los campos presentes en el DTO
   * - Validaciones aplicadas solo a campos proporcionados
   */
  async update(id: number, data: UpdateEventDTO) {
    /**
     * Verifica que el evento existe antes de actualizar
     * findOne() lanza NotFoundException si no existe
     * Se guarda el evento original para incluir su título en el mensaje
     */
    const event = await this.findOne(id);
    /**
     * update() ejecuta UPDATE en la base de datos
     * Equivalente a: UPDATE event SET ... WHERE id = ?
     *
     * Solo actualiza los campos presentes en data (actualización parcial)
     * No retorna la entidad actualizada, solo el resultado de la operación
     */
    await this.eventRepository.update(id, data);
    /**
     * Recupera el evento actualizado para retornarlo en la respuesta
     * findOne() ejecuta SELECT con los datos más recientes
     */
    const updated = await this.findOne(id);
    /**
     * Retorna objeto con mensaje descriptivo y datos actualizados
     * Incluye el título del evento original para contexto
     */
    return {
      message: `Evento "${event.title}" actualizado correctamente`,
      updated,
    };
  }

  /**
   * Elimina un evento de la base de datos
   *
   * @async
   * @method remove
   * @param {number} id - ID del evento a eliminar
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   * @throws {NotFoundException} Si el evento no existe
   *
   * @description
   * Eliminación física del registro (DELETE permanente).
   * Retorna mensaje con ID y título del evento eliminado.
   */
  async remove(id: number) {
    /**
     * Busca el evento antes de eliminarlo
     * findOne() lanza NotFoundException si no existe
     * Se guarda para incluir título en mensaje de confirmación
     */
    const event = await this.findOne(id);
    /**
     * delete() elimina físicamente el registro de la base de datos
     * Equivalente a: DELETE FROM event WHERE id = ?
     */
    await this.eventRepository.delete(id);
    /**
     * Retorna mensaje de confirmación con ID y título del evento eliminado
     * Incluye título para contexto y logging
     */
    return {
      message: `Evento con ID ${id} eliminado correctamente (Título: ${event.title})`,
    };
  }

  /**
   * Obtiene el número total de eventos en la base de datos
   *
   * @async
   * @method getEventsCount
   * @returns {Promise<number>} Cantidad total de eventos
   *
   * @description
   * Retorna el conteo total de eventos registrados en el sistema.
   */
  async getEventsCount(): Promise<number> {
    /**
     * count() ejecuta COUNT(*) en la base de datos
     * Equivalente a: SELECT COUNT(*) FROM event
     * Retorna número entero con el total de registros
     */
    return await this.eventRepository.count();
  }
}
