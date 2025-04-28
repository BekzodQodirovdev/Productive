import { IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyType } from 'src/common/type/otp.type';

export class VerifyDto {
  @ApiProperty({ example: '123456', description: 'OTP kodi' })
  @IsString()
  otp_code: string;

  @ApiProperty({
    example: 'ali@example.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'register',
    description: 'Foydalanuvchi turini aniqlash uchun',
    enum: VerifyType,
    default: VerifyType.REGISTER,
  })
  @IsEnum(VerifyType)
  type: VerifyType;
}
