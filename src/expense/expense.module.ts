import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { ExpenseTransactionModule } from 'src/expense-transaction/expense-transaction.module';

@Module({
  imports: [
    ExpenseTransactionModule,
    WalletModule,
    TypeOrmModule.forFeature([Expense]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
