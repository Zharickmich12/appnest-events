/**
 * @fileoverview Servicio de gestión de usuarios
 * @module UsersService
 * @description Implementa la lógica de negocio y operaciones CRUD para la entidad User.
 * Gestiona la persistencia de datos mediante TypeORM, incluyendo validaciones,
 * encriptación de contraseñas y manejo de duplicados.
 */

/**
 * Injectable: Marca la clase como proveedor inyectable
 * NotFoundException: Excepción HTTP 404 para recursos no encontrados
 * BadRequestException: Excepción HTTP 400 para solicitudes inválidas
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
/**
 * InjectRepository: Decorador para inyectar repositorios de TypeORM
 */
import { InjectRepository } from '@nestjs/typeorm';
/**
 * Repository: Clase base de TypeORM para operaciones de base de datos
 */
import { Repository } from 'typeorm';
/**
 * Entidad User que representa la tabla de usuarios en la base de datos
 */
import { User } from 'src/entities/user.entity';
/**
 * DTOs para validación de datos de entrada
 */
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
/**
 * bcrypt: Librería para hash y comparación segura de contraseñas
 */
import * as bcrypt from 'bcrypt';

/**
 * Servicio de gestión de usuarios
 * 
 * @class UsersService
 * @decorator @Injectable
 * 
 * @description
 * Proporciona métodos para:
 * - Crear usuarios con validación de duplicados y hash de contraseñas
 * - Consultar usuarios (todos o por ID)
 * - Actualizar información de usuarios
 * - Eliminar usuarios del sistema
 * 
 * Todas las contraseñas se almacenan hasheadas usando bcrypt con salt rounds = 10
 */
@Injectable()
export class UsersService {
  /**
   * Constructor del servicio
   * 
   * @constructor
   * @param {Repository<User>} userRepository - Repositorio de TypeORM para User
   * 
   * @description
   * Inyecta el repositorio de User para realizar operaciones de base de datos.
   * TypeORM proporciona métodos predefinidos (find, findOne, save, remove, etc.)
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos
   * 
   * @async
   * @method create
   * @param {CreateUserDto} data - Datos del nuevo usuario (validados por DTO)
   * @returns {Promise<User>} Usuario creado con ID generado
   * @throws {BadRequestException} Si el email ya está registrado
   * 
   * @description
   * Proceso:
   * 1. Verifica que el email no exista en la base de datos
   * 2. Hashea la contraseña con bcrypt (salt rounds: 10)
   * 3. Crea la instancia del usuario
   * 4. Persiste en base de datos
   * 
   * @security
   * - Previene registro de emails duplicados
   * - Almacena contraseñas hasheadas, nunca en texto plano
   * - Mensaje de error genérico para evitar enumeración de usuarios
   */
  async create(data: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe en la base de datos
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    /**
     * Si existe un usuario con ese email, lanza excepción
     * Mensaje genérico para no revelar si el email está registrado (seguridad)
     * Evita que MySQL lance error de "duplicate entry" directamente
     */
    if (existingUser) {
      throw new BadRequestException(
        'No se pudo completar el registro. Verifica tus datos.',
      );
    }

    /**
     * Encriptar la contraseña antes de guardar
     * bcrypt.hash(plainText, saltRounds)
     * - plainText: contraseña en texto plano
     * - saltRounds: 10 (balance entre seguridad y rendimiento)
     * 
     * Genera un hash único incluso para contraseñas idénticas
     */
    data.password = await bcrypt.hash(data.password, 10);

    /**
     * Crear instancia de User con los datos proporcionados
     * create() no persiste en BD, solo crea el objeto en memoria
     */
    const newUser = this.userRepository.create(data);
    /**
     * Persiste el usuario en la base de datos
     * save() ejecuta INSERT y retorna la entidad con ID generado
     */
    return await this.userRepository.save(newUser);
  }

  /**
   * Obtiene todos los usuarios registrados en el sistema
   * 
   * @async
   * @method findAll
   * @returns {Promise<User[]>} Array con todos los usuarios
   * 
   * @description
   * Retorna la lista completa de usuarios sin paginación.
   */
  async findAll(): Promise<User[]> {
    /**
     * find() sin parámetros retorna todos los registros
     * Equivalente a: SELECT * FROM user
     */
    return await this.userRepository.find();
  }

  /**
   * Busca un usuario específico por su ID
   * 
   * @async
   * @method findOne
   * @param {number} id - ID del usuario a buscar
   * @returns {Promise<User>} Usuario encontrado
   * @throws {NotFoundException} Si el usuario no existe
   * 
   * @description
   * Método utilizado internamente por update() y remove().
   * Lanza excepción si no se encuentra el usuario para evitar operaciones inválidas.
   */
  async findOne(id: number): Promise<User> {
    /**
     * findOneBy() busca un registro por criterios específicos
     * Equivalente a: SELECT * FROM user WHERE id = ?
     */
    const user = await this.userRepository.findOneBy({ id });
    /**
     * Si no se encuentra el usuario, lanza excepción HTTP 404
     * Mensaje descriptivo para facilitar debugging
     */
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return user;
  }

  /**
   * Actualiza los datos de un usuario existente
   * 
   * @async
   * @method update
   * @param {number} id - ID del usuario a actualizar
   * @param {UpdateUserDto} data - Datos a actualizar (parciales)
   * @returns {Promise<object>} Objeto con mensaje y datos del usuario actualizado
   * @throws {NotFoundException} Si el usuario no existe
   * @throws {BadRequestException} Si el nuevo email ya está en uso
   * 
   * @description
   * Proceso:
   * 1. Verifica que el usuario existe
   * 2. Si hay cambio de email, valida que no esté en uso
   * 3. Si hay nueva contraseña, la hashea
   * 4. Actualiza los datos
   * 5. Retorna mensaje contextual según si se actualizó la contraseña
   * 
   * @security
   * - Hashea nuevas contraseñas con bcrypt
   * - Valida unicidad de email
   * - No expone contraseña en la respuesta
   */
  async update(id: number, data: UpdateUserDto): Promise<object> {
    /**
     * Busca al usuario existente por su ID
     * Lanza NotFoundException si no existe (validación previa)
     */
    const user = await this.findOne(id);

    /**
     * Validación de email único (solo si se está cambiando)
     * Evita que el usuario pueda "tomar" un email ya registrado
     */
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

    /**
     * Flag para determinar el mensaje de respuesta
     * Diferencia entre actualización normal y cambio de contraseña
     */
    let passwordUpdated = false;

    /**
     * Si se incluye una nueva contraseña, se encripta
     * bcrypt.hash() genera un nuevo hash con salt único
     */
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
      passwordUpdated = true;
    }

    /**
     * Object.assign() copia las propiedades de data a user
     * Solo actualiza los campos presentes en data (actualización parcial)
     */
    Object.assign(user, data);
    /**
     * Persiste los cambios en la base de datos
     * save() ejecuta UPDATE y retorna la entidad actualizada
     */
    const updatedUser = await this.userRepository.save(user);

    /**
     * Retorna objeto con mensaje contextual y datos visibles del usuario
     * Excluye la contraseña hasheada por seguridad
     */
    return {
      message: passwordUpdated
        ? 'Contraseña actualizada correctamente.'
        : 'Usuario actualizado correctamente.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  /**
   * Elimina un usuario de la base de datos
   * 
   * @async
   * @method remove
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<{message: string}>} Mensaje de confirmación
   * @throws {NotFoundException} Si el usuario no existe
   * 
   * @description
   * Eliminación física del registro (DELETE permanente).
   * Para sistemas en producción, considerar implementar soft delete.
   */
  async remove(id: number): Promise<{ message: string }> {
    /**
     * Verifica que el usuario existe antes de intentar eliminar
     * findOne() lanza NotFoundException si no existe
     */
    const user = await this.findOne(id);
    /**
     * remove() elimina físicamente el registro de la base de datos
     * Equivalente a: DELETE FROM user WHERE id = ?
    */
    await this.userRepository.remove(user);
    /**
     * Retorna mensaje de confirmación con el ID eliminado
     */
    return { message: `Usuario con ID ${id} eliminado correctamente.` };
  }
}
