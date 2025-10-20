// Este módulo configura y exporta la conexión principal a la base de datos 
// utilizando TypeORM y MySQL. Se hace uso de variables de entorno para 
// mantener la configuración segura y desacoplada del código fuente.

// Importación de la clase DataSource desde TypeORM.
// DataSource representa la conexión a la base de datos y gestiona el contexto 
// de entidades, repositorios y consultas.
import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Event } from './src/entities/event.entity';
import { EventRegistration } from './src/entities/event-registration.entity';

// Importación del paquete dotenv, el cual permite cargar variables de entorno 
// desde un archivo .env ubicado en la raíz del proyecto.
import * as dotenv from 'dotenv';

// dotenv.config() lee las variables definidas en el archivo .env y las agrega 
// al objeto global process.env, lo que permite acceder a ellas desde cualquier 
// parte del proyecto.
dotenv.config();

// Se crea una nueva instancia de DataSource con los parámetros necesarios 
// para establecer la conexión a la base de datos MySQL.
// Cada propiedad del objeto proviene de las variables de entorno cargadas con dotenv.
export default new DataSource({
  type: 'mysql', // Tipo de base de datos
  host: process.env.DB_HOST, // Dirección del servidor de base de datos (por ejemplo, localhost o IP).
  port: Number(process.env.DB_PORT), // Puerto por donde se establece la conexión (3306 por defecto en MySQL)
  username: process.env.DB_USERNAME, // Nombre del usuario autorizado a acceder a la base de datos.
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME, // Nombre de la base de datos que usará la aplicación.
  entities: [ User, Event, EventRegistration], // Entidades que TypeORM gestionará
  migrations: ['src/migrations/*.ts'] // Ubicación de los archivos de migraciones
});