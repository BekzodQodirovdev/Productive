import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NetWorkEnum } from 'src/common/enum/network.enums';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(NetWorkEnum)
  network?: NetWorkEnum;
}
