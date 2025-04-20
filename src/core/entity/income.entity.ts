import { BaseModel } from 'src/common/database';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Income extends BaseModel {
  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.income)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
