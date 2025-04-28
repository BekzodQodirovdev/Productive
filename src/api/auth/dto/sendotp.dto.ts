import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyType } from 'src/common/type/otp.type';

export class setdOtpDdto {
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
