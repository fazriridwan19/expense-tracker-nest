import { Optional } from '@nestjs/common';
import {
  IsEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateWalletDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @IsOptional()
  saldo: number;

  user: User;
}
