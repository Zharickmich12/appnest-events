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
  UseGuards,
  Request,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDTO } from 'src/dto/create-registration.dto';
import { UpdateRegistrationDTO } from 'src/dto/update-registration.dto';

// Se importan los guards y decoradores para la proteccion de rutas
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';

// Se importan el filtro e interceptor globales.
import { ParseIntPipeCustom } from 'src/common/pipes/parse-int.pipe';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

@UseFilters(HttpExceptionFilter) // filtro global de excepciones
@UseInterceptors(SanitizeResponseInterceptor) // Interceptor para formatear respuestas y eliminar datos sensibles
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas del controlador
@Controller('registrations') // Define el prefijo de las rutas que pertenecen a este controlador
export class RegistrationsController {
  // Inyeccion del servicio de registros para acceder a la logica de negocio.
  constructor(private readonly registrationsService: RegistrationsService) {}

  // Ruta para crear un nuevo registro (inscripcion de un usuario a un evento).
  // Metodo HTTP: POST /registrations
  // retorna el user creado
  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer pueden usar esta ruta
  create(@Body() dto: CreateRegistrationDTO) {
    return this.registrationsService.create(dto);
  }

  // Ruta para obtener todos los registros existentes en la base de datos.
  // Metodo HTTP: GET /registrations
  // Los ATTENDEE pueden ver sus propias inscripciones
  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.ATTENDEE) // todos los roles tienen acceso
  findAll(@Request() req: { user: { userId: number; role: UserRole } }) {
    return this.registrationsService.findAll(req.user);
  }

  // Ruta para obtener un registro especifico por su ID.
  // Metodo HTTP: GET /registrations/:id
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer pueden usar esta ruta
  findOne(@Param('id', ParseIntPipeCustom) id: number) {
    return this.registrationsService.findOne(id);
  }

  // Ruta para actualizar los datos de un registro existente.
  // Permite cambiar, por ejemplo, el evento al que un usuario esta inscrito.
  // Metodo HTTP: PUT /registrations/:id
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER) // Solo admin y organizer usar esta ruta
  update(
    @Param('id', ParseIntPipeCustom) id: number,
    @Body() dto: UpdateRegistrationDTO,
  ) {
    return this.registrationsService.update(id, dto);
  }

  // Ruta para eliminar un registro de inscripcion por su ID.
  // Metodo HTTP: DELETE /registrations/:id
  @Delete(':id')
  @Roles(UserRole.ADMIN) // Solo admin puede usar esta ruta
  remove(@Param('id', ParseIntPipeCustom) id: number) {
    return this.registrationsService.remove(id);
  }
}
