import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Game, User } from '.';

@Entity()
export class GameUser {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  gameId: number;

  @Column('jsonb', { nullable: true })
  playerNumbers: number[];

  @ManyToOne(() => User, (user) => user.gameUsers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Game, (game) => game.gameUsers)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
