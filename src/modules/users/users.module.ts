// Módulo encargado de la gestión de usuarios dentro de la aplicación.
// Define el controlador, el servicio y la configuración de TypeORM
// correspondiente a la entidad User.
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

// Decorador @Module:
// Define los componentes que pertenecen al módulo de usuarios.
@Module({
  // Importa TypeORM y la entidad User para que TypeORM pueda interactuar con la tabla `user`
  imports:[TypeOrmModule.forFeature([User])], 
  // Controlador responsable de manejar las rutas relacionadas con usuarios.
  controllers: [UsersController],
   // Servicio que contiene la lógica de negocio y operaciones sobre los usuarios.
  providers: [UsersService],
  // Exporta el servicio para que pueda ser utilizado por otros módulos.
  exports: [UsersService]
})
export class UsersModule {}
