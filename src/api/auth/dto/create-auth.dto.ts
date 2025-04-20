import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NetWorkEnum } from 'src/common/enum/network.enums';

export class CreateAuthDto {
  @ApiProperty({ example: 'Ali Valiyev', description: 'Foydalanuvchi ismi' })
  @IsString()
  name: string;

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
    example: 'https://example.com/avatar.jpg',
    description: 'Foydalanuvchi rasmi (ixtiyoriy)',
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiPropertyOptional({
    enum: NetWorkEnum,
    description:
      'Ijtimoiy tarmoq orqali ro‘yxatdan o‘tgan bo‘lsa, tarmoq nomi (ixtiyoriy)',
  })
  @IsOptional()
  @IsEnum(NetWorkEnum)
  network?: NetWorkEnum;
}
