import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../eventsapp/eventsapp.module';

@Module({
  imports: [UsersModule, EventsModule],
  controllers: [RegistrationsController],
  providers: [RegistrationsService]
})
export class RegistrationsModule {}
