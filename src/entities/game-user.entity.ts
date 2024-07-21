import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Game, User } from '.';

@Entity()
@Index('IDX_USER_GAME', ['user', 'game']) // Composite index for user and game
export class GameUser {
  @PrimaryColumn()
  @Index()
  userId: number;

  @PrimaryColumn()
  @Index()
  gameId: number;

  @Column('jsonb', { nullable: true })
  playerNumbers: number[];

  @Column({ default: true })
  isPlayerNumberChosen: boolean;

  @ManyToOne(() => User, (user) => user.gameUsers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Game, (game) => game.gameUsers)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
