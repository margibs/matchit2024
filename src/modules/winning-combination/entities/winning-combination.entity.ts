import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WinningCombinationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('winning_combinations')
export class WinningCombination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('jsonb')
  positions: number[][];

  @Column()
  description: string;

  @Column({ name: 'board_id' })
  boardId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'match_count' })
  matchCount: number;

  @Column({
    type: 'enum',
    enum: WinningCombinationStatus,
    default: WinningCombinationStatus.ACTIVE,
  })
  status: WinningCombinationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
