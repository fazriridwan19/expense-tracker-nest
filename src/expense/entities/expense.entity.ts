import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int')
  amount: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user' })
  user: User;
}
