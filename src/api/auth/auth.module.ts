import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptManage } from 'src/infrastructure/lib/bcrypt';
import { User } from 'src/core/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { Otp } from 'src/core/entity/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.register({ global: true }),
    JwtModule.register({
      global: true,
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptManage],
})
export class AuthModule {}
