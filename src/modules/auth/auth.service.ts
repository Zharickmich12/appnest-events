/**
 * @file auth.service.ts
 * @description Servicio que contiene la lógica de negocio para el registro,
 * autenticación y generación de tokens JWT.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from 'src/dto/login-user.dto';


/**
 * @class AuthService
 * @description Implementa la lógica central del proceso de autenticación.
 */
@Injectable()
export class AuthService {

    constructor (
        // Inyección del repositorio de TypeORM para la entidad User
        @InjectRepository(User)
        private userRepo: Repository<User>,
        // Servicio JWT para firmar y verificar tokens.
        private jwtService: JwtService,
    ) {}

    /**
   * @method register
   * @description Registra un nuevo usuario:
   *  1. Hashea la contraseña.
   *  2. Crea y guarda el registro en la base de datos.
   * @param data DTO con la información del nuevo usuario.
   * @returns Mensaje de confirmación y datos del usuario.
   */
    async register(data:CreateUserDto ){
        // Hashea la contraseña con un 'salt' de 10 rondas
        const hashedPassword= await bcrypt.hash(data.password,10);
        // Crea una nueva instancia de usuario con la contraseña hasheada
        const userCreated = this.userRepo.create({...data, password: hashedPassword});
        // Guarda el usuario en la base de datos.
        await this.userRepo.save(userCreated);
        // Retorna información básica del usuario creado.
        return {message: 'Usuario registrado con exito', user: {id:userCreated.id, email: userCreated.email}}
    }

    /**
   * @method login
   * @description Valida credenciales y genera un token JWT.
   *  1. Busca el usuario por email.
   *  2. Verifica la contraseña con bcrypt.
   *  3. Firma un token JWT con los datos del usuario.
   * @param data DTO con las credenciales del usuario.
   * @throws UnauthorizedException si las credenciales son inválidas.
   * @returns Token JWT firmado.
   */
    async login(data:LoginUserDTO){
        // Verifica si el usuario existe en la base de datos.
        const user = await this.userRepo.findOne({where: {email:data.email}})

        // Verifica si el usuario existe
        if(!user){

            throw new UnauthorizedException("Las credenciales son invalidas");

        }

        // Compara la contraseña ingresada con el hash guardado.
        const isPaddwordValid= await bcrypt.compare(data.password, user.password)

        // Verifica si la contraseña es válida
        if (!isPaddwordValid){

            throw new UnauthorizedException ("Las credenciales son invalidas");

        }

        // Define el contenido (payload) del token JWT.
        const payloadToken = {sub:user.id, name:user.name, email:user.email, role: user.role };
        // Firma el token con la clave secreta.
        const token = await this.jwtService.signAsync(payloadToken)
        
        // Retorna el token generado.
        return {

            accesToken: token

        }

    }

    

}
