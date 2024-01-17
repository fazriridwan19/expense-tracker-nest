import { Expense } from 'src/expense/entities/expense.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column('text', { nullable: false })
  password: string;

  @OneToMany(() => Expense, (expense) => expense.user, { cascade: true })
  expenses: Expense[];
}
