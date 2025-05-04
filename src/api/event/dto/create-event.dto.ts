import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({
    description: 'User ID who created the event',
    example: '3bcd3f10-88ee-45c1-ae29-23b5df8a57d4',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
