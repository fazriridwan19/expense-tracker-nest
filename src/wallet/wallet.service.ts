import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) {}

  async create(user: User, createWalletDto: CreateWalletDto) {
    createWalletDto.user = user;
    return await this.walletRepository.save(createWalletDto);
  }

  async findAll(user: User): Promise<Wallet[]> {
    return await this.walletRepository.find({
      where: {
        user: user,
      },
    });
  }

  async findOne(user: User, id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id, user },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet is not found');
    }
    return wallet;
  }

  async update(user: User, id: number, updateWalletDto: UpdateWalletDto) {
    console.log(updateWalletDto);
    const result = await this.walletRepository.update(
      { id, user },
      updateWalletDto,
    );
    if (result.affected === 0)
      throw new NotFoundException('Wallet is not found');
    return this.findOne(user, id);
  }

  async remove(user: User, id: number) {
    const result = await this.walletRepository.delete({ id, user });
    if (result.affected === 0)
      throw new NotFoundException('Wallet is not found');
    return { message: 'Wallet deleted' };
  }
}
