import { ExpenseTransaction } from 'src/expense-transaction/entities/expense-transaction.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Expense, (expense) => expense.currentStatus, {
    cascade: true,
  })
  expenses: Expense[];

  @OneToMany(
    () => ExpenseTransaction,
    (expenseTransaction) => expenseTransaction.status,
    { cascade: true },
  )
  expenseTransactions: ExpenseTransaction[];
}
