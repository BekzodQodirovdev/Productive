import { BaseModel } from 'src/common/database';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Expense extends BaseModel {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.expense)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
