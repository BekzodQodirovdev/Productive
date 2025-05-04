import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({
    description:
      'The unique identifier of the user associated with this income.',
    example: 'fbc8b10c-8b95-45bc-a100-33a29b9cf45f',
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
