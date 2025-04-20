import { BaseModel } from 'src/common/database';
import { TaskStatus } from 'src/common/enum/taskStatus.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task extends BaseModel {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'date' })
  start_time: Date;

  @Column({ type: 'date' })
  end_time: Date;

  @Column({ type: 'boolean' })
  is_done: boolean;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: 'text', array: true })
  location: string[];

  @Column()
  notification: boolean;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.task)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
