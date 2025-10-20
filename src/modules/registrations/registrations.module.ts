// Módulo que gestiona el registro de usuarios a eventos.
// Se integra con los módulos de Users y EventsApp para coordinar la relación
// entre ambos mediante el servicio de Registrations.

import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../eventsapp/eventsapp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/event-registration.entity';

// Decorador @Module:
// Registra los componentes del módulo de registros.
@Module({
  // Importa los módulos necesarios para acceder a usuarios y eventos.
  imports: [
    TypeOrmModule.forFeature([EventRegistration]),
    UsersModule, 
    EventsModule],
  // Controlador responsable de las rutas relacionadas con inscripciones.
  controllers: [RegistrationsController],
  // Servicio que implementa la lógica de registro y vinculación entre usuarios y eventos.
  providers: [RegistrationsService]
})
export class RegistrationsModule {}
