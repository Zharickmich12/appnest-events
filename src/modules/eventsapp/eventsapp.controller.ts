// Se importan los decoradores y clases necesarias desde @nestjs/common
// para definir rutas y manejar peticiones
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
// Se importa el servicio de eventos
import { EventsAppService } from './eventsapp.service';

// Se importan los DTOs que permiten validar los datos de entrada.
import { CreateEventDTO } from 'src/dto/create-event.dto';
import { UpdateEventDTO } from 'src/dto/update-event.dto';

// Se define el controlador de productos con la ruta base /eventsapp
@Controller('eventsapp')
export class EventsAppController {
  // Se inyecta el servicio de eventos para usarlo dentro de este controlador
  constructor(private readonly eventsAppService: EventsAppService) {}

  // Ruta para obtener todos los eventos que estan en la base de datos
  // Metodo HTTP: GET /eventsapp
  @Get()
  async getEvents() {
    const events = await this.eventsAppService.findAll(); // Obtiene la lista completa de los eventos
    const count = await this.eventsAppService.getEventsCount(); // Cuenta el total de eventos
    // Retorna el mensaje con el total de eventos y la imformacion de estos
    return {
      message: 'Lista de eventos obtenida',
      total: count,
      data: events,
    };
  }

  // Ruta para obtener un evento en especifico por su id
  // Metodo HTTP: GET /eventsapp/:id
  @Get(':id')
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsAppService.findOne(id); // Busca el evento por su id
    // Retorna un mensaje con el evento encontrado
    return { message: 'Evento encontrado', event };
  }

  // Ruta para crear un nuevo evento en la base de datos
  // debe contener title, date, description, location, capacity
  // Metodo HTTP: POST /eventsapp
  @Post()
  async create(@Body() dto: CreateEventDTO) {
    return await this.eventsAppService.create(dto);
  }

  // Ruta para actualizar los datos de un evento por su id
  // Ya sea title, date, description, location, capacity
  // Metodo HTTP: PUT /eventsapp/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDTO,
  ) {
    return await this.eventsAppService.update(id, dto);
  }

  // Ruta para eliminar un evento existente por su id
  // Metodo HTTP: DELETE /eventsapp/:id
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsAppService.remove(id);
  }
}
