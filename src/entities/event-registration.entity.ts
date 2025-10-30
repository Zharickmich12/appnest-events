// Entidad que representa la inscripción de un usuario a un evento dentro del sistema.
// Define las relaciones entre las entidades User y Event, y almacena la fecha en que se realizó el registro.
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

/**
 * @class EventRegistration
 * @description Entidad de la base de datos que actúa como una tabla de unión (muchos a muchos con metadatos) entre las entidades User y Event. 
 * Mapea a una tabla denominada "event_registration".
 */
@Entity()
export class EventRegistration {
  /**
   * @property {number} id
   * @description Clave primaria única que identifica de forma individual cada registro de inscripción.
   * @typeorm @PrimaryGeneratedColumn - Generación automática de valores enteros.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @property {User} user
   * @description Relación al usuario asociado a este registro.
   * @typeorm @ManyToOne - Define una relación muchos-a-uno: Múltiples registros a un solo Usuario.
   * @param {() => User} targetEntity - Entidad de destino.
   * @param {(user) => user.registrations} inverseSide - Mapeo inverso a la propiedad 'registrations' en la entidad User.
   */
  @ManyToOne(() => User, (user) => user.registrations)
  user: User;

  /**
   * @property {Event} event
   * @description Relación al evento al que se refiere este registro de inscripción.
   * @typeorm @ManyToOne - Define una relación muchos-a-uno: Múltiples inscripciones a un solo Evento.
   * @param {() => Event} targetEntity - Entidad de destino.
   * @param {(event) => event.registrations} inverseSide - Mapeo inverso a la propiedad 'registrations' en la entidad Event.
   */
  @ManyToOne(() => Event, (event) => event.registrations)
  event: Event;

  /**
   * @property {Date} registeredAt
   * @description Timestamp que almacena la fecha y hora exacta de la creación del registro de inscripción.
   * @typeorm @CreateDateColumn - Genera automáticamente la fecha al insertar la fila.
   */
  @CreateDateColumn()
  registeredAt: Date;
}
