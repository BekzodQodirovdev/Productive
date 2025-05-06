import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/core/entity/task.entity';
import { TaskRepository } from 'src/core/repository/task.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class TasksService extends BaseService<
  CreateTaskDto,
  DeepPartial<Task>
> {
  constructor(@InjectRepository(Task) repository: TaskRepository) {
    super(repository);
  }
}
