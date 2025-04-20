import { Repository } from 'typeorm';
import { Otp } from '../entity/otp.entity';

export type OtpRepository = Repository<Otp>;
