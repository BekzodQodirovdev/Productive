import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsArray,
} from 'class-validator';
import { TaskStatus } from 'src/common/enum/taskStatus.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish project', description: 'Task title' })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    example: 'Complete the backend and frontend integration',
    description: 'Task content or description',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: '2025-05-07',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString()
  start_time: string;

  @ApiProperty({ example: '2025-05-10', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  end_time: string;

  @ApiProperty({ example: false, description: 'Is the task completed?' })
  @IsBoolean()
  is_done: boolean;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.MEDIUM,
    description: 'Task status',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({
    example: ['Tashkent', 'Office'],
    description: 'List of locations',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  location?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Should notification be enabled?',
  })
  @IsBoolean()
  @IsOptional()
  notification?: boolean;

  @IsOptional()
  user_id?: string;
}
