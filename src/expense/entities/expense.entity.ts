import { ExpenseTransaction } from 'src/expense-transaction/entities/expense-transaction.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @OneToMany(
    () => ExpenseTransaction,
    (expenseTransaction) => expenseTransaction.expense,
    { cascade: true },
  )
  expenseTransactions: ExpenseTransaction[];

  @ManyToOne(() => Status, (status) => status.expenses)
  @JoinColumn({ name: 'current_status' })
  currentStatus: Status;
}
