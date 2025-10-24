// Se importan los decoradores y clases necesarias desde @nestjs/common
// para definir rutas y manejar peticiones
// Se importan los DTOs de create y update
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDTO } from 'src/dto/create-registration.dto';
import { UpdateRegistrationDTO } from 'src/dto/update-registration.dto';
import { ParseIntPipe } from '@nestjs/common';

// Define el prefijo de las rutas que pertenecen a este controlador
@Controller('registrations')
export class RegistrationsController {
  // Inyeccion del servicio de registros para acceder a la logica de negocio.
  constructor(private readonly registrationsService: RegistrationsService) {}

  // Ruta para crear un nuevo registro (inscripcion de un usuario a un evento).
  // Metodo HTTP: POST /registrations

  @Post()
  create(@Body() dto: CreateRegistrationDTO) {
    return this.registrationsService.create(dto);
  }

  // Ruta para obtener todos los registros existentes en la base de datos.
  // Metodo HTTP: GET /registrations
  @Get()
  findAll() {
    return this.registrationsService.findAll();
  }

  // Ruta para obtener un registro especifico por su ID.
  // Metodo HTTP: GET /registrations/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registrationsService.findOne(id);
  }

  // Ruta para actualizar los datos de un registro existente.
  // Permite cambiar, por ejemplo, el evento al que un usuario esta inscrito.
  // Metodo HTTP: PUT /registrations/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistrationDTO,
  ) {
    return this.registrationsService.update(id, dto);
  }

  // Ruta para eliminar un registro de inscripcion por su ID.
  // Metodo HTTP: DELETE /registrations/:id
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.registrationsService.remove(id);
  }
}
