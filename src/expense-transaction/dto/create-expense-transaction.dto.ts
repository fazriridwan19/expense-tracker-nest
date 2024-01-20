import { IsDate } from 'class-validator';
import { Expense } from 'src/expense/entities/expense.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

export class CreateExpenseTransactionDto {
  @IsDate()
  at: Date;

  expense: Expense;
  wallet: Wallet;
}
