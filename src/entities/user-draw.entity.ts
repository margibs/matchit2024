import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game, User } from '.';

@Entity()
export class UserDraw {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  gameId: number;

  @Column()
  numberDraw: number;

  @Column()
  boardPosition: number;

  @Column({ type: 'boolean' })
  isMatch: boolean;

  @Column({ type: 'boolean' })
  isDraw: boolean;

  @Column({ type: 'timestamp', nullable: true })
  drawAt: Date;

  // register the hour of the draw
  @Column()
  drawTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userDraws, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Game, (game) => game.userDraws, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  game: Game;
}
