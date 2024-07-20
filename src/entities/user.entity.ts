import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Game, GameUser, UserDraw } from '.';

export enum UserRole {
  ADMIN = 'admin',
  PLAYER = 'player',
  SPONSOR = 'sponsor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true })
  timezoneId: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @OneToMany(() => Game, (game) => game.createdBy)
  games: Game[];

  @OneToMany(() => GameUser, (gameUser) => gameUser.user)
  gameUsers: GameUser[];

  @OneToMany(() => UserDraw, (userDraw) => userDraw.user)
  userDraws: UserDraw[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
