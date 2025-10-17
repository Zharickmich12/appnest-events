import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/eventsapp/eventsapp.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
      type: 'mysql',
      host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,// Carga automáticamente las entidades
        synchronize: false, 
      
    }),

}),
    UsersModule,
    AuthModule,
    EventsModule,
    RegistrationsModule,
    
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
