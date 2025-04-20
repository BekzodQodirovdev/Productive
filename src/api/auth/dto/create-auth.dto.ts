import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NetWorkEnum } from 'src/common/enum/network.enums';

export class CreateAuthDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsEnum(NetWorkEnum)
  network?: NetWorkEnum;
}
