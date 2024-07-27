import { Game } from 'src/modules/game/entities/game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('board_orders')
export class BoardOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @Column()
  number: number;

  @Column()
  gameId: number;

  @ManyToOne(() => Game, (game) => game.boardOrders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
