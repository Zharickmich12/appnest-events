// Controlador encargado de manejar las solicitudes HTTP relacionadas con los usuarios.
// Define las rutas principales para crear, obtener, actualizar y eliminar usuarios del sistema.
import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
// Se importa el servicio de Usuarios
import { UsersService } from './users.service';
// Se importan los DTOs que permiten validar los datos de entrada.
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

// Pipes y filtros personalizados
import { ParseIntPipeCustom } from 'src/common/pipes/parse-int.pipe';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SanitizeResponseInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';

// Se importan los guards y decoradores para la proteccion de rutas
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';

// Decorador @Controller():
// Define el prefijo de las rutas que pertenecen a este controlador.
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas del controlador
@UseFilters(HttpExceptionFilter) // Aplica el filtro a todas las rutas de este controlador
@UseInterceptors(SanitizeResponseInterceptor) // Interceptor para formatear respuestas y eliminar datos sensibles
export class UsersController {
  // Inyección del servicio de usuarios
  constructor(private readonly usersService: UsersService) {}

  // Ruta para crear un nuevo usuario en la base de datos.
  // Método HTTP: POST /users
  @Post()
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  create(@Body() dto: CreateUserDto) {
    if (dto.name && typeof dto.name === 'string') {
      dto.name = dto.name.trim().toUpperCase();
    }
    return this.usersService.create(dto);
  }

  // Ruta para obtener todos los usuarios registrados.
  // Método HTTP: GET /users
  @Get()
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  findAll() {
    return this.usersService.findAll();
  }

  // Ruta para obtener un usuario específico por su ID.
  // Método HTTP: GET /users/:id
  @Get(':id')
  @Roles(UserRole.ADMIN) // Solo admin puede usar esta ruta
  findOne(@Param('id', ParseIntPipeCustom) id: number) {
    return this.usersService.findOne(id);
  }

  // Ruta para actualizar los datos de un usuario existente.
  // Método HTTP: PUT /users/:id
  @Put(':id')
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  update(
    @Param('id', ParseIntPipeCustom) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    // Si el campo 'name' viene en el cuerpo de la solicitud, se transforma a mayúsculas y se eliminan espacios extra.
    if (dto.name && typeof dto.name === 'string') {
      dto.name = dto.name.trim().toUpperCase();
    }

    // Se envía el DTO actualizado al servicio para procesar los cambios.
    return this.usersService.update(id, dto);
  }

  // Ruta para eliminar un usuario por su ID.
  // Método HTTP: DELETE /users/:id
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  remove(@Param('id', ParseIntPipeCustom) id: number) {
    return this.usersService.remove(id);
  }
}
