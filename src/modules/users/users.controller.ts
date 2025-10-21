// Controlador encargado de manejar las solicitudes HTTP relacionadas con los usuarios.
// Define las rutas principales para crear, obtener, actualizar y eliminar usuarios del sistema.
import { Controller, Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

// Decorador @Controller():
// Define el prefijo de las rutas que pertenecen a este controlador.
@Controller('users')
export class UsersController {
    // Inyección del servicio de usuarios para acceder a la lógica de negocio.
    constructor(private readonly usersService: UsersService) {}

    // Ruta para crear un nuevo usuario en la base de datos.
    // Método HTTP: POST /users
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    // Ruta para obtener todos los usuarios registrados.
    // Método HTTP: GET /users
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // Ruta para obtener un usuario específico por su ID.
    // Método HTTP: GET /users/:id
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(Number(id));
    }

    // Ruta para actualizar los datos de un usuario existente.
    // Método HTTP: PUT /users/:id
    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.usersService.update(Number(id), dto);
    }

    // Ruta para eliminar un usuario por su ID.
    // Método HTTP: DELETE /users/:id
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(Number(id));
    }
}