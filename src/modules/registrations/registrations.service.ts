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

// Enum que define los roles del sistema
import { UserRole } from 'src/entities/user.entity';

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
  // En caso de no existir lanza un error
  async create(dto: CreateRegistrationDTO) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    if (!user)
      throw new NotFoundException(
        `Usuario con ID ${dto.userId} no encontrado.`,
      );
    if (!event)
      throw new NotFoundException(
        `Evento con ID ${dto.eventId} no encontrado.`,
      );
    const registration = this.registrationRepo.create({ user, event });
    return this.registrationRepo.save(registration);
  }

  // Obtener todas las inscripciones de la base de datos
  // Los ATTENDEE solo ven sus propias inscripciones
  async findAll(user: { userId: number; role: UserRole }) {
    if (user.role === UserRole.ATTENDEE) {
      return this.registrationRepo.find({
        where: { user: { id: user.userId } },
        relations: ['user', 'event'],
        order: { id: 'ASC' },
      });
    } else {
      return this.registrationRepo.find({
        relations: ['user', 'event'],
        order: { id: 'ASC' },
      });
    }
  }

  // Obtener una inscripción por ID
  // Si no se encuentra lanza una excepcion
  async findOne(id: number) {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    return registration;
  }

  // Actualizar inscripción (cambiar usuario o evento)
  // Permite cambiar el usuario o el evento
  // Lanza error si no existe el registro o el id del usuario
  async update(id: number, dto: UpdateRegistrationDTO) {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user)
        throw new NotFoundException(
          `Usuario con ID ${dto.userId} no encontrado.`,
        );
      registration.user = user;
    }

    if (dto.eventId) {
      const event = await this.eventRepo.findOne({
        where: { id: dto.eventId },
      });
      if (!event)
        throw new NotFoundException(
          `Evento con ID ${dto.eventId} no encontrado.`,
        );
      registration.event = event;
    }

    return this.registrationRepo.save(registration);
  }

  // Eliminar inscripción
  // si el registro no existe devuelve un mensaje de que no fue encontrado
  async remove(id: number) {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    if (!registration)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);

    await this.registrationRepo.delete(id);
    return registration;
  }
}
