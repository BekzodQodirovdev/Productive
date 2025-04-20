import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async otpSend(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'OTP CODE',
        from: 'Bekzodjon.uz <no-reply@bekzodjon.uz>',
        html: `<p>Your OTP code -> <b>${code}</b></p>`,
      });
    } catch (err) {
      console.error('Error sending OTP email:', err.message);
    }
  }
}
