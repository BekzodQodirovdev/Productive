import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NetWorkEnum } from 'src/common/enum/network.enums';

export class LoginUserDto {
  @ApiProperty({
    example: 'ali@example.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    minLength: 6,
    description: 'Foydalanuvchi paroli',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    enum: NetWorkEnum,
    description:
      'Ijtimoiy tarmoq orqali kirgan bo‘lsa, tarmoq nomi (ixtiyoriy)',
  })
  @IsOptional()
  @IsEnum(NetWorkEnum)
  network?: NetWorkEnum;
}
