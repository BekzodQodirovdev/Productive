import { IsEmail } from 'class-validator';

export class setdOtpDdto {
  @IsEmail()
  email: string;
}
