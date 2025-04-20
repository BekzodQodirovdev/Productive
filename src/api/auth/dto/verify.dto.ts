import { IsString, IsEmail } from 'class-validator';

export class VerifyDto {
  @IsString()
  otp_code: string;

  @IsEmail()
  email: string;
}
