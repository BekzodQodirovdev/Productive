import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { VerifyDto } from './dto/verify.dto';
import { setdOtpDdto } from './dto/sendotp.dto';
import { UserID } from 'src/common/decorator/user-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdatePasswordDto } from './dto/update-password';
import { AuthUpdatePassword } from 'src/common/guard/jwt-update-password.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';
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
    return this.authService.sendOtp(data);
  }

  // token must
  @ApiBearerAuth()
  @Get('profile')
  profile(@UserID() id: string) {
    return this.authService.profile(id);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(AuthUpdatePassword)
  @Patch('forgot-password')
  updatePassword(@Body() data: UpdatePasswordDto, @Req() res: Request) {
    return this.authService.updatePassword(data, res);
  }

  @ApiBearerAuth()
  @Patch('user')
  updateUser(@UserID() id: string, @Body() data: UpdateAuthDto) {
    return this.authService.updateUser(id, data);
  }
}
