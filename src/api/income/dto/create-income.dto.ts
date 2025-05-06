import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({
    description: 'The price of the income.',
    example: 100.5,
    type: 'number',
    format: 'decimal',
  })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'A description of the income.',
    example: 'Salary payment for the month of May',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  user_id?: string;
}
