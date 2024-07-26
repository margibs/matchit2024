import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardOrder, GameUser, UserDraw } from '.';
import { User } from 'src/modules/user/entities/user.entity';
import { Board } from 'src/modules/board/entities/board.entity';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DONE = 'done',
  PAUSED = 'paused',
}

@Entity()
@Index('IDX_STATUS', ['status']) // Index on status field
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
    default: Status.ACTIVE,
  })
  status: Status;

  @Column()
  duration: number;

  @Column({ type: 'timestamp', nullable: true, precision: 0 })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true, precision: 0 })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true, precision: 0 })
  pickingDate: Date;

  @Column({ type: 'enum', enum: ['random', 'sequential'] })
  boardPosition: 'random' | 'sequential';

  @Column({ nullable: true })
  numberPicking: number;

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

  @OneToMany(() => BoardOrder, (boardOrder) => boardOrder.game, {
    cascade: true,
  })
  boardOrders: BoardOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
