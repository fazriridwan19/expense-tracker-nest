import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  user: User;

  @IsNumber()
  @IsOptional()
  walletId: number;

  @IsNumber()
  @IsOptional()
  expenseTransactionId: number;
}
