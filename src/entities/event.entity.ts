// Entidad que representa un evento dentro del sistema.
// Contiene información básica del evento y define las relaciones con los usuarios y registros de inscripción.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventRegistration } from './event-registration.entity';

/**
 * @class Event
 * @description Entidad principal de la base de datos que representa un evento.
 */
@Entity()
export class Event {
  /**
   * @property {number} id
   * @description Clave primaria única para la entidad Event.
   * @typeorm @PrimaryGeneratedColumn - Generación automática de valores enteros.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @property {string} title
   * @description Título descriptivo y obligatorio del evento.
   * @typeorm @Column - Mapea a una columna VARCHAR/TEXT/STRING no nula.
   */
  @Column({ unique: true })
  title: string;

  /**
   * @property {string} description
   * @description Descripción completa y detallada del evento.
   * @typeorm @Column('text') - Mapea a una columna de tipo TEXT para cadenas de gran longitud.
   */
  @Column('text')
  description: string;

  /**
   * @property {Date} date
   * @description Fecha y hora programada para el evento.
   * @typeorm @Column - Mapea a una columna de tipo DATE/DATETIME/TIMESTAMP.
   */
  @Column()
  date: Date;

  /**
   * @property {string} location
   * @description Ubicación física o virtual donde se llevará a cabo el evento.
   * @typeorm @Column
   */
  @Column()
  location: string;

  /**
   * @property {number} capacity
   * @description Capacidad máxima de asistentes permitidos para el evento.
   * @typeorm @Column({ default: 100 }) - Valor por defecto: 100.
   */
  @Column({ default: 100 })
  capacity: number;

  /**
   * @property {string} email
   * @description Correo electrónico del organizador o persona responsable del evento.
   * @typeorm @Column - Mapea a una columna de cadena.
   */
  @Column()
  email: string;

  /**
   * @property {EventRegistration[]} registrations
   * @description Colección de registros de inscripción asociados a este evento.
   * @typeorm @OneToMany - Define una relación uno-a-muchos: Un Evento tiene muchos Registros.
   * @param {() => EventRegistration} targetEntity - Entidad relacionada.
   * @param {(registration) => registration.event} inverseSide - Mapeo inverso a la propiedad 'event' en la entidad EventRegistration.
   */
  @OneToMany(() => EventRegistration, (registration) => registration.event)
  registrations: EventRegistration[];
}
