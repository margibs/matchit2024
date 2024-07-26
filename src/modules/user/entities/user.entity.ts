import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Game } from 'src/modules/game/entities/game.entity';
import { GameUser } from 'src/modules/game/entities/game-user.entity';
import { UserDraw } from 'src/modules/game/entities/user-draw.entity';
import { Timezone } from './timezone.entity';

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

  @ManyToOne(() => Timezone, (timezone) => timezone.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  timezone: Timezone;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({ nullable: true })
  rrs_id: string;

  @Column({ nullable: true })
  rrs_token: string;

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
