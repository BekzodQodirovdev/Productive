import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({ example: '123456', description: 'OTP kodi' })
  @IsString()
  otp_code: string;

  @ApiProperty({ example: 'ali@example.com', description: 'Foydalanuvchi email manzili' })
  @IsEmail()
  email: string;
}
