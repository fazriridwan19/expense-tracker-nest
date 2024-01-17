import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  min,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  user: User;
}
