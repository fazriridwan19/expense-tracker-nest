import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExpenseTransaction } from './entities/expense-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExpenseTransactionDto } from './dto/create-expense-transaction.dto';
import { UpdateExpenseTransactionDto } from './dto/update-expense-transaction.dto';
import { User } from 'src/user/entities/user.entity';
import { Expense } from 'src/expense/entities/expense.entity';

@Injectable()
export class ExpenseTransactionService {
  constructor(
    @InjectRepository(ExpenseTransaction)
    private expenseTransactionRepository: Repository<ExpenseTransaction>,
    private dataSource: DataSource,
  ) {}

  async create(createExpenseTransactionDto: CreateExpenseTransactionDto) {
    return await this.expenseTransactionRepository.save(
      createExpenseTransactionDto,
    );
  }

  async findAll(user: User): Promise<ExpenseTransaction[]> {
    return await this.expenseTransactionRepository.find({
      where: {
        expense: {
          user: user,
        },
      },
    });
  }

  async findOne(user: User, id: number) {
    const expenseTransaction = await this.expenseTransactionRepository.findOne({
      where: {
        id,
        expense: { user },
      },
      relations: {
        expense: true,
        wallet: true,
      },
    });
    if (!expenseTransaction)
      throw new NotFoundException('Expense transaction is not found');
    return expenseTransaction;
  }

  async update(
    id: number,
    user: User,
    updateExpenseTransactionDto: UpdateExpenseTransactionDto,
  ) {
    return `This action updates a #${id} expenseTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} expenseTransaction`;
  }
}
