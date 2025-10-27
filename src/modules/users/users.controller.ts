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
} from '@nestjs/common';
// Se importa el servicio de Usuarios
import { UsersService } from './users.service';
// Se importan los DTOs que permiten validar los datos de entrada.
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

// Se importan los guards y decoradores para la proteccion de rutas
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';

// Decorador @Controller():
// Define el prefijo de las rutas que pertenecen a este controlador.
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas del controlador
export class UsersController {
  // Inyección del servicio de usuarios para acceder a la lógica de negocio.
  constructor(private readonly usersService: UsersService) {}

  // Ruta para crear un nuevo usuario en la base de datos.
  // Método HTTP: POST /users
  @Post()
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  create(@Body() dto: CreateUserDto) {
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
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(Number(id));
  }

  // Ruta para actualizar los datos de un usuario existente.
  // Método HTTP: PUT /users/:id
  @Put(':id')
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  // Ruta para eliminar un usuario por su ID.
  // Método HTTP: DELETE /users/:id
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  // Solo admin puede usar esta ruta
  remove(@Param('id') id: number) {
    return this.usersService.remove(Number(id));
  }
}
