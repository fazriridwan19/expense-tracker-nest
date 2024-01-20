import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { DataSource, Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { ExpenseTransaction } from 'src/expense-transaction/entities/expense-transaction.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Status } from 'src/status/entities/status.entity';
import { ExpenseTransactionService } from 'src/expense-transaction/expense-transaction.service';
import { use } from 'passport';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private dataSource: DataSource,
    private walletService: WalletService,
    private expenseTransactionService: ExpenseTransactionService,
  ) {}

  async create(user: User, createExpenseDto: CreateExpenseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userWallet = await this.walletService.findOne(
        user,
        createExpenseDto.walletId,
      );
      if (!userWallet) {
        throw new NotFoundException(
          `${user.username} does not have wallet with id ${createExpenseDto.walletId}`,
        );
      }
      if (userWallet.saldo < createExpenseDto.amount) {
        throw new BadRequestException(`the balance is not sufficient`);
      }
      /**
       * 1. Save expense
       * 2. update saldo
       * 3. buat transaksi
       */
      const createdStatus = await queryRunner.manager
        .getRepository(Status)
        .findOne({
          where: {
            id: 1,
          },
        });
      const expense = new Expense();
      expense.name = createExpenseDto.name;
      expense.description = createExpenseDto.description;
      expense.amount = createExpenseDto.amount;
      expense.user = user;
      expense.currentStatus = createdStatus;
      const savedExpense = await queryRunner.manager.save(expense);

      userWallet.saldo = userWallet.saldo - createExpenseDto.amount;
      await queryRunner.manager.save(userWallet);

      const expTran = new ExpenseTransaction();
      expTran.expense = savedExpense;
      expTran.wallet = userWallet;
      expTran.status = createdStatus;
      expTran.at = new Date();
      await queryRunner.manager.save(expTran);
      await queryRunner.commitTransaction();

      return expTran;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new NotFoundException(error.message);
      }
    } finally {
      await queryRunner.release();
    }
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
    /**
     * 1. cek apakah ada pergantian wallet ?
     * 2. jika ada, set saldo = saldo + amount expense saat ini & set dengan wallet yang baru
     * 3. cek apakah ada pergantian amount ?
     * 4. jika ada, set saldo = saldo + (amount lama - amount baru)
     * 5. save expense (currentStatus = updated)
     * 6. save wallet
     * 7. save expense transaction (status = updated)
     */

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let expenseDb = await this.findOne(user, id);
      let walletDb = await this.walletService.findOne(
        user,
        updateExpenseDto.walletId,
      );
      let updatedStatus = await queryRunner.manager
        .getRepository(Status)
        .findOneBy({ id: 2 });
      if (
        updateExpenseDto.amount &&
        updateExpenseDto.amount !== expenseDb.amount
      ) {
        walletDb.saldo =
          walletDb.saldo + (expenseDb.amount - updateExpenseDto.amount);
        expenseDb.amount = updateExpenseDto.amount;
      }
      expenseDb.name = updateExpenseDto.name
        ? updateExpenseDto.name
        : expenseDb.name;
      expenseDb.description = updateExpenseDto.description
        ? updateExpenseDto.description
        : expenseDb.description;
      expenseDb.currentStatus = updatedStatus;

      const newExpTran = new ExpenseTransaction();
      newExpTran.at = new Date();
      newExpTran.expense = expenseDb;
      newExpTran.wallet = walletDb;
      newExpTran.status = updatedStatus;

      await queryRunner.manager.save(expenseDb);
      await queryRunner.manager.save(walletDb);
      await queryRunner.manager.save(newExpTran);
      await queryRunner.commitTransaction();

      return newExpTran;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error(error.message);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async remove(user: User, id: number, updateExpenseDto: UpdateExpenseDto) {
    const deleteStatus = await this.dataSource
      .getRepository(Status)
      .findOneBy({ id: 3 });
    const expense = await this.findOne(user, id);
    const wallet = await this.walletService.findOne(
      user,
      updateExpenseDto.walletId,
    );

    expense.currentStatus = deleteStatus;
    const newExpTran = new ExpenseTransaction();
    newExpTran.at = new Date();
    newExpTran.expense = expense;
    newExpTran.wallet = wallet;
    newExpTran.status = deleteStatus;
    await this.expenseRepository.save(expense);
    await this.dataSource.getRepository(ExpenseTransaction).save(newExpTran);
    return { message: 'Expense deleted' };
  }
}
