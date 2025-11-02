/**
 * @fileoverview Configuración de conexión a base de datos MySQL con TypeORM
 * @module typeorm.config
 * @description Este módulo establece la conexión principal a la base de datos
 * utilizando TypeORM como ORM. La configuración se carga desde variables de
 * entorno para mantener la seguridad y permitir diferentes configuraciones
 * según el ambiente (desarrollo, producción, testing).
 */

/**
 * DataSource: Clase principal de TypeORM que representa la conexión a la BD
 * y gestiona el contexto de entidades, repositorios, migraciones y consultas.
 */
import { DataSource } from 'typeorm';

/**
 * Entidades del dominio que serán gestionadas por TypeORM
 */
import { User } from './src/entities/user.entity';
import { Event } from './src/entities/event.entity';
import { EventRegistration } from './src/entities/event-registration.entity';

/**
 * dotenv: Permite cargar variables de entorno desde archivo .env
 */
import * as dotenv from 'dotenv';

/**
 * Carga las variables de entorno desde el archivo .env ubicado en la raíz
 * del proyecto y las inyecta en process.env
 */
dotenv.config();

/**
 * Instancia de DataSource configurada para MySQL
 *
 * @constant
 * @type {DataSource}
 *
 * @property {string} type - Tipo de base de datos (MySQL)
 * @property {string} host - Hostname del servidor MySQL (desde DB_HOST)
 * @property {number} port - Puerto de conexión MySQL (desde DB_PORT, default: 3306)
 * @property {string} username - Usuario de la base de datos (desde DB_USERNAME)
 * @property {string} password - Contraseña del usuario (desde DB_PASSWORD)
 * @property {string} database - Nombre de la base de datos (desde DB_NAME)
 * @property {Array<Function>} entities - Entidades TypeORM a gestionar
 * @property {Array<string>} migrations - Patrón glob para archivos de migración
 *
 * @example
 *  Variables de entorno requeridas en .env:
 * DB_HOST=localhost
 * DB_PORT=3306
 * DB_USERNAME=root
 * DB_PASSWORD=password
 * DB_NAME=mi_base_datos
 *
 * @exports DataSource
 */

export default new DataSource({
  type: 'mysql', // Tipo de base de datos soportado por TypeORM
  host: process.env.DB_HOST, // Dirección del servidor de base de datos (por ejemplo, localhost o IP).
  port: Number(process.env.DB_PORT), // Puerto por donde se establece la conexión (3306 por defecto en MySQL)
  username: process.env.DB_USERNAME, // Nombre del usuario autorizado a acceder a la base de datos.
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME, // Nombre de la base de datos que usará la aplicación.
  /**
   * Array de clases de entidad que TypeORM sincronizará con las tablas de BD
   * Cada entidad representa una tabla y define su estructura mediante decoradores
   */
  entities: [User, Event, EventRegistration],
  /**
   * Patrón de archivos de migración para versionamiento de esquema de BD
   * Las migraciones permiten aplicar cambios estructurales de forma controlada
   */
  migrations: ['src/migrations/*.ts'], // Ubicación de los archivos de migraciones
});
