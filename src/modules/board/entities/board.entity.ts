import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from 'src/modules/game/entities/game.entity';
import { WinningCombination } from 'src/modules/winning-combination/entities/winning-combination.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  boardSize: number;

  @OneToMany(() => Game, (game) => game.board)
  games: Game[];

  @OneToMany(
    () => WinningCombination,
    (winningCombination) => winningCombination.board,
  )
  winningCombinations: WinningCombination[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
