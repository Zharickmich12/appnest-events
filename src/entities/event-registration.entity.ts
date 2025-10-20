// Entidad que representa la inscripción de un usuario a un evento dentro del sistema.
// Define las relaciones entre las entidades User y Event, y almacena la fecha en que se realizó el registro.
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

// Decorador @Entity():
// Indica que esta clase corresponde a una tabla en la base de datos llamada "event_registration".
@Entity()
export class EventRegistration {
  // Columna primaria autogenerada que identifica de forma única cada registro.
  @PrimaryGeneratedColumn()
  id: number;

  // Relación muchos-a-uno (ManyToOne) con la entidad User:
  // Cada registro pertenece a un solo usuario, pero un usuario puede tener múltiples registros.
  @ManyToOne(() => User, (user) => user.registrations)
  user: User;

  // Relación muchos-a-uno (ManyToOne) con la entidad Event:
  // Cada registro corresponde a un solo evento, pero un evento puede tener múltiples inscripciones.
  @ManyToOne(() => Event, (event) => event.registrations)
  event: Event;
  
  // Columna que almacena la fecha y hora en que el usuario se registró en el evento.
  // Se genera automáticamente al crear el registro.
  @CreateDateColumn()
  registeredAt: Date;
}