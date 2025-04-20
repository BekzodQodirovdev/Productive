import { BaseModel } from 'src/common/database';
import { NetWorkEnum } from 'src/common/enum/network.enums';
import { Column, Entity, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { Notification } from './notification.entity';
import { Expense } from './expense.entity';
import { Event } from './event.entity';
import { Income } from './income.entity';

@Entity()
export class User extends BaseModel {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: NetWorkEnum,
    default: NetWorkEnum.EMAIL,
  })
  network: NetWorkEnum;

  @OneToMany(() => Task, (task) => task.user)
  task: Task;

  @OneToMany(() => Expense, (expense) => expense.user)
  expense: Expense;

  @OneToMany(() => Event, (event) => event.user)
  event: Event;

  @OneToMany(() => Income, (income) => income.user)
  income: Income;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification;
}
