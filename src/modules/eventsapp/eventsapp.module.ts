import { Module } from '@nestjs/common';
import { EventsappController } from './eventsapp.controller';
import { EventsappService } from './eventsapp.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [EventsappController],
  providers: [EventsappService],
  exports: [EventsappService]
})
export class EventsModule {}
