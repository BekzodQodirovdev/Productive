import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { DeepPartial } from 'typeorm';
import { Event } from 'src/core/entity/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from 'src/core/repository/event.repository';

@Injectable()
export class EventService extends BaseService<
  CreateEventDto,
  DeepPartial<Event>
> {
  constructor(@InjectRepository(Event) repository: EventRepository) {
    super(repository);
  }
}
