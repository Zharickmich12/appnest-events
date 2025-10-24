// Se importan los decoradores y Excepciones necesarias
import { Injectable, NotFoundException } from '@nestjs/common';
// Se importa InjectRepository para inyectar el repositorio
import { InjectRepository } from '@nestjs/typeorm';
// Se importa Repository para interactuar con la base de datos
import { Repository } from 'typeorm';
// Se importan las entidades User, Events y EventRegistration
import { EventRegistration } from 'src/entities/event-registration.entity';
import { User } from 'src/entities/user.entity';
import { Event } from 'src/entities/event.entity';
// Se importa los DTO utilizados para la creacion y actualizacion de registros
import { CreateRegistrationDTO } from 'src/dto/create-registration.dto';
import { UpdateRegistrationDTO } from 'src/dto/update-registration.dto';

// Permite que este servicio pueda ser inyectado en controladores u otros servicios.
@Injectable()
export class RegistrationsService {
  // Inyección de repositorios TypeORM para interactuar con las entidades
  // EventRegistration, User y Event dentro de la base de datos.
  constructor(
    @InjectRepository(EventRegistration)
    private registrationRepo: Repository<EventRegistration>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  // Crea un nuevo registro de inscripcion entre un usuario y un evento
  // Verifica que tanto el usuario como el evento existan antes de guardar
  async create(dto: CreateRegistrationDTO) {
    // Verificación del usuario
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    // Verificación del evento
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    // Validaciones, evitan crear registros con datos inexistentes
    if (!user)
      throw new NotFoundException(
        `Usuario con ID ${dto.userId} no encontrado.`,
      );
    if (!event)
      throw new NotFoundException(
        `Evento con ID ${dto.eventId} no encontrado.`,
      );
    // Creacion del nuevo registro de inscripcion
    const registration = this.registrationRepo.create({ user, event });
    const saved = await this.registrationRepo.save(registration);

    // Retornar mensaje con datos organizados
    return {
      message: 'Registro creado correctamente',
      registration: {
        id: saved.id,
        registeredAt: saved.registeredAt,
        user: { id: user.id, name: user.name, email: user.email },
        event: { id: event.id, title: event.title, date: event.date },
      },
    };
  }

  // Obtener todas las inscripciones de la base de datos
  async findAll() {
    const registrations = await this.registrationRepo.find({
      relations: ['user', 'event'], // Se incluyen relaciones con User y Event
      order: { id: 'ASC' }, // Ordena los registros por ID
    });

    // Da la respuesta de forma mas organizada y facil de entender
    return registrations.map((r) => ({
      id: r.id,
      registeredAt: r.registeredAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        role: r.user.role,
      },
      event: {
        id: r.event.id,
        title: r.event.title,
        date: r.event.date,
        location: r.event.location,
      },
    }));
  }

  // Obtener una inscripción por ID
  // Si no se encuentra lanza una excepcion
  async findOne(id: number) {
    const r = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!r) throw new NotFoundException(`Registro con ID ${id} no encontrado.`);

    return {
      id: r.id,
      registeredAt: r.registeredAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        role: r.user.role,
      },
      event: {
        id: r.event.id,
        title: r.event.title,
        date: r.event.date,
        location: r.event.location,
      },
    };
  }

  // Actualizar inscripción (cambiar usuario o evento)
  async update(id: number, dto: UpdateRegistrationDTO) {
    // Busca el registro actual por su id esto incluye las relaciones con user y event
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    // Si no se encuentra el registro, lanza una excepcion
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);

    // Si el DTO incluye un nuevo userId, se busca el nuevo usuario
    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });

      // Si no existe el usuario indicado, se lanza un error
      if (!user)
        throw new NotFoundException(
          `Usuario con ID ${dto.userId} no encontrado.`,
        );

      // Si existe, se reemplaza el usuario actual de la inscripcion por el nuevo
      registration.user = user;
    }

    // Si el DTO incluye un nuevo eventId, se busca el nuevo evento
    if (dto.eventId) {
      const event = await this.eventRepo.findOne({
        where: { id: dto.eventId },
      });

      // Si no existe el evento indicado, se lanza un error
      if (!event)
        throw new NotFoundException(
          `Evento con ID ${dto.eventId} no encontrado.`,
        );
      // Si existe, se reemplaza el evento actual de la inscripcion por el nuevo
      registration.event = event;
    }

    // Guarda el registro actualizado en la base de datos
    const updated = await this.registrationRepo.save(registration);

    // Devuelve un mensaje y los datos actualizados
    return {
      message: `Registro actualizado correctamente`,
      registration: {
        id: updated.id,
        registeredAt: updated.registeredAt,
        user: {
          id: updated.user.id,
          name: updated.user.name,
          email: updated.user.email,
        },
        event: {
          id: updated.event.id,
          title: updated.event.title,
          date: updated.event.date,
        },
      },
    };
  }

  // Eliminar inscripción
  // si el registro no existe devuelve un mensaje de que no fue encontrado
  async remove(id: number) {
    // Buscar el registro junto con sus relaciones
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    // Si no existe, devolve error
    if (!registration) {
      return { message: `No se encontró ningún registro con ID ${id}` };
    }

    // si el registro existe se elimina y devuelve mensaje de que fue eliminado
    await this.registrationRepo.delete(id);

    return {
      message: `Registro eliminado correctamente`,
      deleted: {
        id,
        user: registration.user.name,
        event: registration.event.title,
      },
    };
  }
}
