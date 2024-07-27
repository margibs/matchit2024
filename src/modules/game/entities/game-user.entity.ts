import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Game } from 'src/modules/game/entities/game.entity';
import { WinningCombination } from 'src/modules/winning-combination/entities/winning-combination.entity';

@Entity('gamer_users')
@Index('IDX_USER_GAME', ['user', 'game']) // Composite index for user and game
export class GameUser {
  @PrimaryColumn()
  @Index()
  userId: number;

  @PrimaryColumn()
  @Index()
  gameId: number;

  @Column({ nullable: true })
  winningCombinationId: number;

  @Column('jsonb', { nullable: true })
  playerNumbers: number[];

  @Column({ default: true })
  isPlayerNumberChosen: boolean;

  @Column('jsonb', { nullable: true })
  winning_positions: number[];

  @Column('jsonb', { nullable: true })
  winning_numbers: number[];

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  winningPrice: number;

  @ManyToOne(
    () => WinningCombination,
    (winningCombination) => winningCombination.gameUsers,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'winningCombinationId' })
  winningCombination: WinningCombination;

  @ManyToOne(() => User, (user) => user.gameUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Game, (game) => game.gameUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
