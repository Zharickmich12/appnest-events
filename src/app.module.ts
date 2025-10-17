// Define el módulo raíz de la aplicación. Configura la conexión a la base de datos
// mediante TypeORM, carga las variables de entorno y registra los módulos principales.
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importación de los módulos funcionales del sistema.
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/eventsapp/eventsapp.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { UsersModule } from './modules/users/users.module';

// Decorador @Module:
// Define las dependencias, controladores y servicios que pertenecen al módulo raíz.
@Module({
  imports: [
    // Carga de variables desde el archivo .env y las hace accesibles globalmente.
    ConfigModule.forRoot({isGlobal:true}),
    
    // Configuración asincrónica de TypeORM usando variables del .env
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule], // Importa ConfigModule para leer valores
      inject:[ConfigService], // Inyecta el servicio de configuración
      useFactory:(config:ConfigService)=>({
        type: 'mysql', // Tipo de base de datos
        host: config.get<string>('DB_HOST'), // Dirección del servidor
        port: config.get<number>('DB_PORT'), // Puerto de conexión
        username: config.get<string>('DB_USERNAME'), // Usuario de conexión
        password: config.get<string>('DB_PASSWORD'), // Contraseña del usuario
        database: config.get<string>('DB_NAME'), // Nombre de la base de datos
        autoLoadEntities: true,// Carga automáticamente las entidades
        synchronize: false,  // Desactiva sincronización automática (producción)
      
      }),
    }),
    // Registro de los módulos de la aplicación.
    UsersModule,
    AuthModule,
    EventsModule,
    RegistrationsModule,
    
  ],
  // Controladores principales de la aplicación.
  controllers: [AppController],
  // Servicios globales disponibles en todo el sistema.
  providers: [AppService],
})
export class AppModule {}
