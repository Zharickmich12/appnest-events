// Entidad que representa un evento dentro del sistema.
// Contiene información básica del evento y define las relaciones con los usuarios y registros de inscripción.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventRegistration } from './event-registration.entity';

// Decorador @Entity():
// Indica que esta clase corresponde a una tabla en la base de datos llamada "event".
@Entity()
export class Event {
  // Columna primaria autogenerada que identifica de forma única cada evento.
  @PrimaryGeneratedColumn()
  id: number;

  // Columna que almacena el título del evento (obligatorio).
  @Column()
  title: string;

  // Columna de tipo texto que almacena la descripción completa del evento.
  @Column('text')
  description: string;

  // Columna que almacena la fecha y hora del evento.
  @Column()
  date: Date;

  // Columna que almacena la ubicación del evento.
  @Column()
  location: string;

  // Columna que define la capacidad máxima de asistentes del evento (valor por defecto 100).
  @Column({ default: 100 })
  capacity: number;

  // Correo electronico asociado al evento osea la persona responsable
  @Column()
  email: string;

  // Relación uno-a-muchos (OneToMany) con EventRegistration:
  // Un evento puede tener múltiples registros de usuarios inscritos.
  @OneToMany(() => EventRegistration, (registration) => registration.event)
  registrations: EventRegistration[];
}
