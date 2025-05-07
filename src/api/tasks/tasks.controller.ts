import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@UserID() id: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create({ ...createTaskDto, user_id: id });
  }

  @Get()
  findAll(@UserID() id: string, @Query() filterDto: FilterTasksDto) {
    return this.tasksService.findAllCustom(id, filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
