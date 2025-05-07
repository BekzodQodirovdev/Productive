import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/core/entity/task.entity';
import { TaskRepository } from 'src/core/repository/task.repository';
import { DeepPartial } from 'typeorm';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService extends BaseService<
  CreateTaskDto,
  DeepPartial<Task>
> {
  constructor(@InjectRepository(Task) repository: TaskRepository) {
    super(repository);
  }
  async findAllCustom(id: string, filterDto: FilterTasksDto) {
    const {
      page = 1,
      limit = 10,
      q,
      sort = 'title',
      date,
      priority,
    } = filterDto;

    const query = this.getRepository.createQueryBuilder('task');
    query.where('task.user_id = :id', { id });

    if (q) {
      if (sort === 'title') {
        query.andWhere('LOWER(task.title) LIKE LOWER(:q)', { q: `%${q}%` });
      } else if (sort === 'content') {
        query.andWhere('LOWER(task.content) LIKE LOWER(:q)', { q: `%${q}%` });
      } else {
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:q) OR LOWER(task.content) LIKE LOWER(:q))',
          { q: `%${q}%` },
        );
      }

      if (priority) {
        query.andWhere('task.status = :priority', { priority });
      }

      if (date) {
        query.andWhere(
          '(DATE(task.start_time) = :date OR DATE(task.end_time) = :date)',
          { date },
        );
      }

      query.orderBy(`task.${sort}`, 'ASC');
      const data = await query.getMany();

      return {
        status_code: 201,
        message: 'success',
        data,
      };
    }

    if (priority) {
      query.andWhere('task.status = :priority', { priority });
    }

    if (date) {
      query.andWhere(
        '(DATE(task.start_time) = :date OR DATE(task.end_time) = :date)',
        { date },
      );
    }

    query.orderBy(`task.${sort}`, 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      status_code: 201,
      message: 'success',
      data: {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
