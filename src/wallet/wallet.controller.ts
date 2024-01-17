import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return await this.walletService.create(user, createWalletDto);
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    return await this.walletService.findAll(user);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.walletService.findOne(user, +id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return await this.walletService.update(user, +id, updateWalletDto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.walletService.remove(user, +id);
  }
}
