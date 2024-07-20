import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '.';

@Entity()
export class BoardOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @Column()
  number: number;

  @Column()
  gameId: number;

  @ManyToOne(() => Game, (game) => game.boardOrders)
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
