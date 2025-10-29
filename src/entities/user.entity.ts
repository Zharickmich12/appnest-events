// Entidad que representa un usuario dentro del sistema.
// Contiene la información de acceso, perfil y las relaciones con eventos y registros de inscripción.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { EventRegistration } from './event-registration.entity';

// Roles posibles de un usuario
export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  ATTENDEE = 'attendee',
}

// Decorador @Entity():
// Indica que esta clase corresponde a una tabla en la base de datos llamada "user".
@Entity()
export class User {
  // Columna primaria autogenerada que identifica de manera única cada usuario.
  @PrimaryGeneratedColumn()
  id: number;

  // Columna que almacena el correo electrónico del usuario (único y obligatorio).
  @Column({ unique: true })
  email: string;

  // Columna que almacena la contraseña del usuario (obligatoria).
  @Column()
  password: string;

  // Columna que almacena el nombre completo del usuario (obligatorio).
  @Column()
  name: string;

  // Columna que indica el rol del usuario en el sistema.
  // Puede ser 'admin', 'organizer' o 'attendee'. Por defecto 'attendee'.
  @Column({ default: 'attendee' })
  role: 'admin' | 'organizer' | 'attendee';

  // Relación uno-a-muchos (OneToMany) con EventRegistration:
  // Un usuario puede tener múltiples registros de inscripción a eventos.
  @OneToMany(() => EventRegistration, (registration) => registration.user)
  registrations: EventRegistration[];
}
