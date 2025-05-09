import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserRepository } from 'src/core/repository/user.repository';
import { User } from 'src/core/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptManage } from 'src/infrastructure/lib/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OtpRepository } from 'src/core/repository/otp.repository';
import { Otp } from 'src/core/entity/otp.entity';
import { EmailService } from '../email/email.service';
import { IPayload } from 'src/common/interfaces';
import { config } from 'src/config';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-auth.dto';
import { VerifyDto } from './dto/verify.dto';
import { OtpGenerator } from 'src/infrastructure/lib/otp';
import { setdOtpDdto } from './dto/sendotp.dto';
import { UpdatePasswordDto } from './dto/update-password';
import { VerifyType } from 'src/common/type/otp.type';
import Redis from 'ioredis';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: UserRepository,
    @InjectRepository(Otp) private readonly otpRepository: OtpRepository,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
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
    // if (userData?.network != 'email') {
    //   userData.is_active = true;
    // }
    const { password, ...saveData } = await this.repository.save(userData);
    const otp_code_g = OtpGenerator();
    const otp_code = this.otpRepository.create({
      otp_code: otp_code_g,
      email: saveData.email,
      type: VerifyType.REGISTER,
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
      secret: config.ACCESS_TOKEN_KEY,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: config.REFRESH_TOKEN_KEY,
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
      res.cookie('refreshToken', refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(`Error on write to cookie: ${error}`);
    }
  }

  async verify(data: VerifyDto) {
    if (data.type == 'register') {
      const otp_data = await this.otpRepository.findOne({
        where: { email: data.email },
      });
      const user = await this.repository.findOne({
        where: { email: data.email },
      });
      if (!otp_data || !user) {
        throw new NotFoundException('You are not registered yet!');
      } else if (
        otp_data.otp_code != data.otp_code ||
        otp_data.type != data.type
      ) {
        throw new BadRequestException('OTP code error!!!');
      }
      if (user?.is_active) {
        throw new BadRequestException('You are already active');
      }
      await this.repository.update(user.id, { is_active: true });
      return {
        status_code: 202,
        message: 'Success activated',
        data: {},
      };
    } else if (data.type == VerifyType.UPDATE_PASSWORD) {
      const otp_data = await this.otpRepository.findOne({
        where: { email: data.email },
      });
      if (!otp_data) {
        throw new NotFoundException('OTP not found for this email!');
      } else if (
        otp_data.otp_code != data.otp_code ||
        otp_data.type != data.type
      ) {
        throw new BadRequestException('OTP code error!!!');
      }
      const token = this.jwtService.sign(
        {
          email: data.email,
          type: VerifyType.UPDATE_PASSWORD,
          sub: otp_data.id,
        },
        {
          secret: config.JWT_SECRET,
          expiresIn: '1h',
        },
      );

      return {
        status_code: 202,
        message: 'OTP verified for password reset',
        data: { token },
      };
    }
  }

  async sendOtp(data: setdOtpDdto) {
    const { email, type } = data;
    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('You are not registered yet!');
    }
    if (type == 'register') {
      if (user.is_active) {
        throw new BadRequestException('You are already active');
      }
    }
    const currentOtp = await this.otpRepository.findOne({ where: { email } });
    if (!currentOtp) {
      throw new NotFoundException('You are not registered yet!');
    }
    const now = new Date();
    if (now < currentOtp.otp_time) {
      throw new BadRequestException('Otp haliham ishlamoqda');
    }
    const otp_codeG = OtpGenerator();
    const otp = {
      ...currentOtp,
      otp_code: otp_codeG,
      type: type,
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
    return this.repository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        created_at: true,
        updated_at: true,
        network: true,
        is_active: true,
      },
    });
  }

  async updatePassword(dto: UpdatePasswordDto, req: Request) {
    const getToken = req.headers.authorization?.split(' ')[1];
    const token1 = await this.redis.get(`otp:token_${getToken}`);
    if (token1) {
      throw new BadRequestException('Parol allaqachon yangilangan');
    }
    const { email, password } = dto;
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newPassword = await this.manageBcrypt.createBcryptPassword(password);
    await this.repository.update(user.id, {
      password: newPassword,
      updated_at: new Date(Date.now()),
    });
    await this.redis.set(`otp:token_${getToken}`, getToken as string);
    return {
      status_code: 200,
      message: 'Success',
      data: {},
    };
  }

  async updateUser(id: string, data: UpdateAuthDto) {
    const userData = await this.repository.findOne({ where: { id } });
    if (!userData) {
      throw new HttpException('not found', 404);
    }
    if (userData?.password) {
      const newPassword = await this.manageBcrypt.createBcryptPassword(
        userData.password,
      );
      userData.password = newPassword;
    }
    await this.repository.update(id, {
      ...userData,
      updated_at: new Date(Date.now()),
    });
    return {
      status_code: 200,
      message: 'success',
      data: {},
    };
  }
}
