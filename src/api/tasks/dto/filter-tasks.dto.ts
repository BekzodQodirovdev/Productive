import {
  IsOptional,
  IsIn,
  IsDateString,
  IsInt,
  Min,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from 'src/common/enum/taskStatus.enum';
import { Type } from 'class-transformer';

export class FilterTasksDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ['title', 'content'],
    description: 'Sort by title or content',
    default: 'title',
  })
  @IsOptional()
  @IsIn(['title', 'content'])
  sort?: 'title' | 'content';

  @ApiPropertyOptional({
    description: 'Filter by created date (e.g. 2024-01-01)',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter by priority',
  })
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  priority?: TaskStatus;

  @ApiPropertyOptional({ description: 'Search by title or content' })
  @IsOptional()
  @IsString()
  q?: string;
}
