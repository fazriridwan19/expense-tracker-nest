import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { ExpenseModule } from './expense/expense.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Expense } from './expense/entities/expense.entity';
import { ConfigModule } from '@nestjs/config';
import { Wallet } from './wallet/entities/wallet.entity';
import { ExpenseTransactionModule } from './expense-transaction/expense-transaction.module';
import { ExpenseTransaction } from './expense-transaction/entities/expense-transaction.entity';
import { StatusModule } from './status/status.module';
import { Status } from './status/entities/status.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA,
      entities: [User, Expense, Wallet, ExpenseTransaction, Status],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    WalletModule,
    ExpenseModule,
    ExpenseTransactionModule,
    StatusModule,
  ],
})
export class AppModule {}
