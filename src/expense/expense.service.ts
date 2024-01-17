import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(user: User, createExpenseDto: CreateExpenseDto) {
    createExpenseDto.user = user;
    return await this.expenseRepository.save(createExpenseDto);
  }

  async findAll(user: User): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: {
        user: user,
      },
    });
  }

  async findOne(user: User, id: number) {
    const expense = await this.expenseRepository.findOne({
      where: {
        id: id,
        user: user,
      },
    });
    if (!expense) {
      throw new NotFoundException('Expense is not found');
    }
    return expense;
  }

  async update(user: User, id: number, updateExpenseDto: UpdateExpenseDto) {
    const result = await this.expenseRepository.update(
      { id: id, user: user },
      updateExpenseDto,
    );
    if (result.affected === 0)
      throw new NotFoundException('Expense is not found');
    return this.findOne(user, id);
    // const result = await this.expenseRepository
    //   .createQueryBuilder()
    //   .update(Expense)
    //   .set({
    //     name: updateExpenseDto.name,
    //     description: updateExpenseDto.description,
    //     amount: updateExpenseDto.amount,
    //   })
    //   .where('id = :id', { id: id })
    //   .andWhere('user = :user', { user: user.id })
    //   .execute();
    // if (result.affected === 0) {
    //   throw new NotFoundException('Expense is not found');
    // }
    // return result;
  }

  async remove(user: User, id: number) {
    const result = await this.expenseRepository
      .createQueryBuilder()
      .delete()
      .from(Expense)
      .where('id = :expenseId', { expenseId: id })
      .andWhere('user = :userId', { userId: user.id })
      .execute();
    if (result.affected === 0)
      throw new NotFoundException('Expense is not found');
    return { message: 'Expense deleted' };
  }
}
