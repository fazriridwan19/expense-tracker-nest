import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegistrationDto } from 'src/auth/dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(registrationDto: RegistrationDto): Promise<User> {
    const countUserByUsername = await this.userRepository.count({
      where: {
        username: registrationDto.username,
      },
    });
    if (countUserByUsername > 0) {
      throw new BadRequestException('This username already used');
    }
    const hashPassword = await bcrypt.hash(registrationDto.password, 10);
    registrationDto.password = hashPassword;
    return this.userRepository.save(registrationDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
      },
      relations: {
        expenses: true,
      },
    });
  }
}
