import { Expense } from 'src/expense/entities/expense.entity';
import { Status } from 'src/status/entities/status.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ExpenseTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  at: Date;

  @ManyToOne(() => Expense, (expense) => expense.expenseTransactions)
  @JoinColumn({ name: 'expense' })
  expense: Expense;

  @ManyToOne(() => Wallet, (wallet) => wallet.expenseTransactions)
  @JoinColumn({ name: 'wallet' })
  wallet: Wallet;

  @ManyToOne(() => Status, (status) => status.expenseTransactions)
  @JoinColumn({ name: 'status' })
  status: Status;
}
