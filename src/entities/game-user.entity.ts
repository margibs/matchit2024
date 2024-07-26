import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Game } from '.';
import { User } from 'src/modules/user/entities/user.entity';

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
