import { Repository } from 'typeorm';
import { Event } from '../entity/event.entity';

export type EventRepository = Repository<Event>;
