import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { VerifyDto } from './dto/verify.dto';
import { setdOtpDdto } from './dto/sendotp.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerUserDto: CreateAuthDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto, res);
  }

  @Public()
  @Post('verify')
  verify(@Body() data: VerifyDto) {
    return this.authService.verify(data);
  }

  @Public()
  @Post('send-otp')
  sendOtp(@Body() data: setdOtpDdto) {
    return this.authService.sendOtp(data.email);
  }

  @Get('profile')
  profile(@UserID() id: string) {
    return this.authService.profile(id);
  }
}
