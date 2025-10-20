import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { EventRegistration } from './event-registration.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'attendee' })
  role: 'admin' | 'organizer' | 'attendee';

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @OneToMany(() => EventRegistration, (registration) => registration.user)
  registrations: EventRegistration[];
}