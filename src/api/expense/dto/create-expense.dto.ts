import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Title of the expense',
    example: 'Office Supplies',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the expense',
    example: 'Purchase of pens, notebooks, and printer ink',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Amount spent',
    example: 50.0,
    type: 'number',
    format: 'decimal',
  })
  @IsNotEmpty()
  price: number;

  @IsOptional()
  user_id?: string;
}
