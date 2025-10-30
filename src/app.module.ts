/**
 * @fileoverview Módulo raíz de la aplicación NestJS
 * @module AppModule
 * @description Define y configura el módulo principal que orquesta todos los
 * submódulos de la aplicación. Establece la conexión a la base de datos MySQL
 * mediante TypeORM, carga variables de entorno y registra módulos funcionales.
 */

/**
 * Module: Decorador que define un módulo de NestJS
 */
import { Module } from '@nestjs/common';
/**
 * Componentes del módulo raíz (controlador y servicio base)
 */
import { AppController } from './app.controller';
import { AppService } from './app.service';
/**
 * TypeOrmModule: Módulo de integración de TypeORM con NestJS
 */
import { TypeOrmModule } from '@nestjs/typeorm';
/**
 * ConfigModule y ConfigService: Para gestión de variables de entorno
 */
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Módulos de dominio que implementan la funcionalidad principal del sistema
 */
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/eventsapp/eventsapp.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { UsersModule } from './modules/users/users.module';

/**
 * Módulo raíz de la aplicación
 * 
 * @class AppModule
 * @decorator @Module
 * 
 * @description
 * Módulo principal que actúa como punto de entrada de la aplicación NestJS.
 * Responsabilidades:
 * - Configurar la conexión a la base de datos MySQL
 * - Cargar y validar variables de entorno
 * - Registrar todos los módulos funcionales del sistema
 * - Exponer controladores y servicios globales
 * 
 * @property {Array} imports - Módulos importados y sus configuraciones
 * @property {Array} controllers - Controladores registrados en el módulo
 * @property {Array} providers - Servicios disponibles en el módulo
 */
@Module({
  imports: [
    /**
     * ConfigModule.forRoot()
     * Carga variables de entorno desde archivo .env
     * 
     * @config isGlobal: true - Hace que el módulo esté disponible globalmente
     * sin necesidad de importarlo en cada módulo hijo
     * 
     * @description
     * Lee el archivo .env de la raíz del proyecto y expone las variables
     * a través del ConfigService. Configuración global permite acceso desde
     * cualquier módulo sin importaciones adicionales.
     */
    ConfigModule.forRoot({ isGlobal: true }),

    /**
     * TypeOrmModule.forRootAsync()
     * Configuración asíncrona de TypeORM para conexión a MySQL
     * 
     * @description
     * Patrón asíncrono permite inyectar ConfigService y cargar valores
     * dinámicamente desde variables de entorno. Esto evita hardcodear
     * credenciales y permite diferentes configuraciones por ambiente.
     * 
     * @param {Object} config - Objeto de configuración
     * @param {Array} config.imports - Módulos necesarios para la configuración
     * @param {Array} config.inject - Servicios a inyectar en useFactory
     * @param {Function} config.useFactory - Factory function que retorna configuración
     */
    TypeOrmModule.forRootAsync({
      /**
       * Importa ConfigModule para acceder a ConfigService
       * Aunque es global, se declara explícitamente para claridad
       */
      imports: [ConfigModule], 
      /**
       * Inyecta ConfigService en la factory function
       * Permite acceso a variables de entorno cargadas
       */
      inject: [ConfigService],
      /**
       * Factory function que construye la configuración de TypeORM
       * 
       * @param {ConfigService} config - Servicio de configuración inyectado
       * @returns {TypeOrmModuleOptions} Objeto de configuración de TypeORM
       */ 
      useFactory: (config: ConfigService) => ({
        /**
         * @property {string} type - Tipo de base de datos (MySQL)
         * Determina el dialecto SQL y driver a utilizar
         */
        type: 'mysql', 
        /**
         * @property {string} host - Hostname del servidor MySQL
         * Obtenido de variable de entorno DB_HOST
         * Ejemplos: 'localhost', '127.0.0.1', 'db.example.com'
         */
        host: config.get<string>('DB_HOST'),
        /**
         * @property {number} port - Puerto de conexión MySQL
         * Obtenido de variable de entorno DB_PORT
         * Default MySQL: 3306
         */
        port: config.get<number>('DB_PORT'),
        /**
         * @property {string} username - Usuario de la base de datos
         * Obtenido de variable de entorno DB_USERNAME
         * Debe tener permisos adecuados en la BD
         */
        username: config.get<string>('DB_USERNAME'), 
        /**
         * @property {string} password - Contraseña del usuario
         * Obtenido de variable de entorno DB_PASSWORD
         * NUNCA debe hardcodearse en el código fuente
         */
        password: config.get<string>('DB_PASSWORD'), 
        /**
         * @property {string} database - Nombre de la base de datos
         * Obtenido de variable de entorno DB_NAME
         * La BD debe existir previamente o ser creada por migraciones
         */
        database: config.get<string>('DB_NAME'),
        /**
         * @property {boolean} autoLoadEntities - Carga automática de entidades
         * true: TypeORM descubre automáticamente entidades desde los módulos
         * Evita tener que listar manualmente todas las entidades
         */
        autoLoadEntities: true, 
        /**
         * @property {boolean} synchronize - Sincronización automática de esquema
         * false: Desactivado para seguridad en producción
         * 
         * @warning NUNCA activar en producción
         * true sincronizaría automáticamente el esquema de BD con las entidades,
         * pudiendo causar pérdida de datos. Usar migraciones en su lugar.
         * 
         * Útil solo en desarrollo temprano para prototipado rápido
         */
        synchronize: false, 
      }),
    }),
    /**
     * UsersModule: Gestión de usuarios del sistema
     * CRUD de usuarios, perfiles, roles y permisos
     */
    UsersModule,
    /**
     * AuthModule: Autenticación y autorización
     * Login, registro, JWT, guards, estrategias de autenticación
     */
    AuthModule,
    /**
     * EventsModule: Gestión de eventos
     * CRUD de eventos
     */
    EventsModule,
    /**
     * RegistrationsModule: Gestión de inscripciones a eventos
    */
    RegistrationsModule,
  ],
  /**
   * Controladores registrados en el módulo raíz
   * 
   * @property {Array<Type>} controllers - Lista de controladores
   * 
   * @description
   * AppController maneja rutas de nivel raíz (generalmente solo endpoints básicos
   * como health checks o página de bienvenida). La mayoría de endpoints están
   * en los controladores de los módulos funcionales.
   */
  controllers: [AppController],
  /**
   * Controladores registrados en el módulo raíz
   * 
   * @property {Array<Type>} controllers - Lista de controladores
   * 
   * @description
   * AppController maneja rutas de nivel raíz (generalmente solo endpoints básicos
   * como health checks o página de bienvenida). La mayoría de endpoints están
   * en los controladores de los módulos funcionales.
   */
  providers: [AppService],
})
export class AppModule {}
