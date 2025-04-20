import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class setdOtpDdto {
  @ApiProperty({
    example: 'ali@example.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsEmail()
  email: string;
}
