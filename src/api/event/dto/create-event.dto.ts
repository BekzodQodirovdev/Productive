import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Frontend Bootcamp',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example: 'A 3-day intensive frontend development bootcamp',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Start date of the event (ISO format)',
    example: '2025-06-01',
    type: 'string',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({
    description: 'End date of the event (ISO format)',
    example: '2025-06-03',
    type: 'string',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @IsOptional()
  user_id?: string;
}
