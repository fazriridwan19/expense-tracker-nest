import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ default: 0 })
  saldo: number = 0;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'user' })
  user: User;
}
