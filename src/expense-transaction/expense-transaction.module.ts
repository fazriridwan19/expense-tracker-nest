import { Module } from '@nestjs/common';
import { ExpenseTransactionService } from './expense-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseTransaction } from './entities/expense-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseTransaction])],
  providers: [ExpenseTransactionService],
  exports: [ExpenseTransactionService],
})
export class ExpenseTransactionModule {}
