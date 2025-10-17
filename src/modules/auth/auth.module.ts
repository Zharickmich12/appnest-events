import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Module({

  imports:[
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forFeature([]),
  ],

  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
