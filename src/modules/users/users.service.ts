// Servicio encargado de gestionar la lógica de negocio y la persistencia de datos
// relacionados con los usuarios del sistema. Utiliza TypeORM para interactuar con
// la base de datos y ejecutar las operaciones CRUD sobre la entidad User.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

// Decorador @Injectable():
// Permite que este servicio pueda ser inyectado en otros componentes (controladores u otros servicios).
@Injectable()
export class UsersService {
    // Inyección del repositorio de la entidad User para permitir operaciones con la base de datos.
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Crea un nuevo usuario en la base de datos.
    async create(data: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
    }

    // Retorna la lista completa de usuarios registrados.
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    // Busca un usuario por su ID.
    // Lanza una excepción si el usuario no existe.
    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return user;
    }

    // Actualiza los datos de un usuario existente.
    async update(id: number, data: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, data);
        return await this.userRepository.save(user);
    }

    // Elimina un usuario de la base de datos.
    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
}