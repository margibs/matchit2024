import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board, BoardOrder, GameUser, User, UserDraw } from '.';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DONE = 'done',
  PAUSED = 'paused',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  randomRepeatAllowed: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INACTIVE,
  })
  status: Status;

  @Column()
  duration: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  pickingDate: Date;

  @Column({ type: 'enum', enum: ['random', 'sequential'] })
  boardPosition: 'random' | 'sequential';

  @Column({ nullable: true })
  numberPicking: string;

  @Column()
  numberPickFrequency: number;

  @ManyToOne(() => User, (user) => user.games)
  createdBy: User;

  @ManyToOne(() => Board, (board) => board.games)
  board: Board;

  @OneToMany(() => GameUser, (gameUser) => gameUser.game)
  gameUsers: GameUser[];

  @OneToMany(() => UserDraw, (userDraw) => userDraw.game)
  userDraws: UserDraw[];

  @OneToMany(() => BoardOrder, (boardOrder) => boardOrder.game)
  boardOrders: BoardOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
