// Módulo que gestiona toda la lógica y rutas relacionadas con los eventos
// dentro de la aplicación (creación, listado, actualización, etc.).

import { Module } from '@nestjs/common';
import { EventsappController } from './eventsapp.controller';
import { EventsappService } from './eventsapp.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Decorador @Module:
// Configura los componentes del módulo de eventos.
@Module({
  // Importa TypeORM y registra las entidades relacionadas con los eventos.
  imports: [TypeOrmModule.forFeature([])],
  // Controlador que maneja las peticiones HTTP sobre los eventos.
  controllers: [EventsappController],
  // Servicio que contiene la lógica de negocio de los eventos.
  providers: [EventsappService],
  // Exporta el servicio para permitir su uso en otros módulos (como Registrations).
  exports: [EventsappService]
})
export class EventsModule {}
