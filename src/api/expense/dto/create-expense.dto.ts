import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({
    description: 'ID of the user who recorded the expense',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
