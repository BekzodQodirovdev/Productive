import { BaseModel } from 'src/common/database';
import { VerifyType } from 'src/common/type/otp.type';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'otp' })
export class Otp extends BaseModel {
  @Column()
  otp_code: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp' })
  otp_time: Date;

  @Column({ type: 'enum', enum: VerifyType })
  type: VerifyType;
}
