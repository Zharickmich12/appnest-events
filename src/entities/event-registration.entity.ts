import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity()
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.registrations)
  user: User;

  @ManyToOne(() => Event, (event) => event.registrations)
  event: Event;

  @CreateDateColumn()
  registeredAt: Date;
}