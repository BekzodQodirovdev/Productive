import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserRepository } from 'src/core/repository/user.repository';
import { User } from 'src/core/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptManage } from 'src/infrastructure/lib/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'otp-generator';
import { OtpRepository } from 'src/core/repository/otp.repository';
import { Otp } from 'src/core/entity/otp.entity';
import { EmailService } from '../email/email.service';
import { IPayload } from 'src/common/interfaces';
import { config } from 'src/config';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-auth.dto';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: UserRepository,
    @InjectRepository(Otp) private readonly otpRepository: OtpRepository,
    private readonly manageBcrypt: BcryptManage,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  async register(dto: CreateAuthDto) {
    const newPassword = await this.manageBcrypt.createBcryptPassword(
      dto.password,
    );

    dto.password = newPassword;

    const userData = this.repository.create(dto);

    const { password, ...saveData } = await this.repository.save(userData);
    const otp_code_g = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otp_code = this.otpRepository.create({
      otp_code: otp_code_g,
      email: saveData.email,
      otp_time: new Date(Date.now() + 30 * 1000),
    });

    await this.otpRepository.save(otp_code);
    this.emailService.otpSend(saveData.email, otp_code_g);

    return { status_code: 201, message: 'Success', data: saveData };
  }

  async login(dto: LoginUserDto, res: Response) {
    const currentData = await this.repository.findOne({
      where: { email: dto.email },
    });

    if (!currentData) {
      throw new BadRequestException('Email or Password is wrong');
    }
    const isMatch = await this.manageBcrypt.comparePassword(
      dto.password,
      currentData?.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Email or Password is wrong');
    }
    if (!currentData.is_active) {
      throw new ForbiddenException(`You are not active.`);
    }
    const network = dto.network ?? 'email';
    if (currentData.network != network) {
      throw new ForbiddenException(`You are logged in from another network.`);
    }
    const payload: IPayload = {
      sub: currentData.id,
      email: currentData.email,
      is_active: currentData.is_active,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: config.JWT_SECRET,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: config.JWT_SECRET,
      expiresIn: config.REFRESH_TOKEN_TIME,
    });
    const { password, ...data } = currentData;
    this.writeToCookie(refreshToken, res);
    return {
      accessToken,
      refreshToken,
      data,
    };
  }

  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token', refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  }

  async verify(data: VerifyDto) {
    const otp_data = await this.otpRepository.findOne({
      where: { email: data.email },
    });
    const user = await this.repository.findOne({
      where: { email: data.email },
    });
    if (!otp_data || !user) {
      throw new NotFoundException('You are not registered yet!');
    } else if (otp_data.otp_code != data.otp_code) {
      throw new BadRequestException('OTP code error!!!');
    }
    if (user?.is_active) {
      throw new BadRequestException('You are already active');
    }
    await this.repository.update(user.id, { is_active: true });
    await this.otpRepository.delete(otp_data.id);
    return {
      status_code: 202,
      message: 'Success activated',
      data: {},
    };
  }

  async sendOtp(email: string) {
    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('You are not registered yet!');
    }
    if (user.is_active) {
      throw new BadRequestException('You are already active');
    }
    const currentOtp = await this.otpRepository.findOne({ where: { email } });
    if (!currentOtp) {
      throw new NotFoundException('You are not registered yet!');
    }
    const now = new Date();
    if (now < currentOtp.otp_time) {
      throw new BadRequestException('Otp haliham ishlamoqda');
    }
    const otp_codeG = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otp = {
      ...currentOtp,
      otp_code: otp_codeG,
      otp_time: new Date(Date.now() + 30 * 1000),
    };
    await this.otpRepository.update(currentOtp.id, otp);
    this.emailService.otpSend(otp.email, otp.otp_code);
    return {
      status_code: 200,
      message: 'Success',
      data: {},
    };
  }

  profile(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}
