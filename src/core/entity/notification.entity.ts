import { BaseModel } from 'src/common/database';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Notification extends BaseModel {
  @Column({ type: 'uuid' })
  task_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => Task, (task) => task.notification)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
