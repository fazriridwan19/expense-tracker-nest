import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private dataSource: DataSource,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.dataSource.getRepository(User).findOneBy({
      username: loginDto.username,
    });
    if (!user) {
      throw new UnauthorizedException('Username or password is invalid');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username or password is invalid');
    }
    return this.generateToken(user.id, user.username);
  }
  async generateToken(userId: number, username: string): Promise<any> {
    const payload = {
      sub: userId,
      username,
    };
    const secret = this.config.get('SECRET_TOKEN');
    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '10m',
    });
    return { token };
  }
  async registration(registrationDto: RegistrationDto) {
    const user = await this.userService.create(registrationDto);
    return this.generateToken(user.id, user.username);
  }
}
