import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity';

export type TaskRepository = Repository<Task>;
