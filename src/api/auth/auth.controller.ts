import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { VerifyDto } from './dto/verify.dto';
import { setdOtpDdto } from './dto/sendotp.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto, res);
  }
  @Post('verify')
  verify(@Body() data: VerifyDto) {
    return this.authService.verify(data);
  }

  @Post('send-otp')
  sendOtp(@Body() data: setdOtpDdto) {
    return this.authService.sendOtp(data.email);
  }

  @Get('profile')
  profile(@UserID() id: string) {
    return this.authService.profile(id);
  }
}
