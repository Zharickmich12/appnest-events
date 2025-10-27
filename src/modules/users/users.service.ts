// Servicio encargado de gestionar la lógica de negocio y la persistencia de datos
// relacionados con los usuarios del sistema. Utiliza TypeORM para interactuar con
// la base de datos y ejecutar las operaciones CRUD sobre la entidad User.
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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
  async create(data: CreateUserDto): Promise<object> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    // si existe lanza un error
    // Esto evita que el SQL lanze el error de duplicate entry
    if (existingUser) {
      throw new BadRequestException(
        'No se pudo completar el registro. Verifica tus datos.',
      );
    }

    // Encriptar la contraseña antes de guardar el usuario.
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    // Crear y guardar el nuevo usuario.
    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);

    // Retornar un mensaje con los datos del usuario creado
    return {
      message: 'Usuario creado correctamente.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
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
  async update(id: number, data: UpdateUserDto): Promise<object> {
    //Busca al usuario existente por id
    const user = await this.findOne(id);

    // Si se quiere cambiar el correo, verificar que no exista otro igual
    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new BadRequestException(
          'El correo ya está registrado por otro usuario',
        );
      }
    }

    // Si se incluye una contraseña, se encripta
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Actualizar los datos del usuario
    Object.assign(user, data);
    const updatedUser = await this.userRepository.save(user);

    // Retornar mensaje de confirmación y datos actualizados.
    return {
      message: 'Usuario actualizado correctamente',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  // Elimina un usuario de la base de datos
  async remove(id: number): Promise<object> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    // Retorna mensaje de confirmacion
    return {
      message: `Usuario con ID ${id} eliminado correctamente.`,
    };
  }
}
