// Se importan los decoradores y Excepciones necesarias
import { Injectable, NotFoundException } from '@nestjs/common';
// Se importa InjectRepository para inyectar el repositorio
import { InjectRepository } from '@nestjs/typeorm';
// Se importa Repository para interactuar con la base de datos
import { Repository } from 'typeorm';
// Se importa la entidad Event
import { Event } from 'src/entities/event.entity';
// Se importan los DTOs de Event
import { CreateEventDTO } from 'src/dto/create-event.dto';
import { UpdateEventDTO } from 'src/dto/update-event.dto';

// Se define el servicio de productos y se marca como inyectable
@Injectable()
export class EventsAppService {
  // Inyeccion del repositorio de la entidad event
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  // Metodo para obtener todos los eventos de la base de datos
  // Retorna una lista con los eventos
  findAll() {
    return this.eventRepository.find();
  }

  // Metodo para buscar un evento por id
  // si el evento no existe lanza una excepcion
  async findOne(id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event)
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    return event;
  }

  // Metodo para crear un evento en la base de datos
  // Utiliza el DTO para validar los datos antes de guardarlos
  async create(data: CreateEventDTO) {
    // Crea una instancia de la entidad a partir del DTO que recibio
    const newEvent = this.eventRepository.create(data);
    // Guarda el nuevo evento en la base de datos y lo retorna
    return await this.eventRepository.save(newEvent);
  }

  // Metodo para actualizar los datos de un evento que ya existe
  // Recibe el id del evento y los datos que se van a cambiar validados con el DTO
  async update(id: number, data: UpdateEventDTO) {
    // Verifica si el evento existe antes de actualizarlo
    const event = await this.findOne(id);

    await this.eventRepository.update(id, data);
    // Retorna un mensaje con el evento actualizado
    const updated = await this.findOne(id);
    return {
      message: `Evento "${event.title}" actualizado correctamente`,
      updated,
    };
  }

  // Metodo para eliminar un evento por su id
  // Si el evento no existe lanza una excepcion
  async remove(id: number) {
    // Busca el evento antes de eliminarlo y despues retorna el mensaje de que fue eliminado
    const event = await this.findOne(id);
    await this.eventRepository.delete(id);
    return {
      message: `Evento con ID ${id} eliminado correctamente (Título: ${event.title})`,
    };
  }

  // Metodo para obtener la cantidad total de eventos de la base de datos
  // Retorna el numero total de registros de la base de datos
  async getEventsCount(): Promise<number> {
    return await this.eventRepository.count();
  }
}
