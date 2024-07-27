import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponse {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;
}

@Exclude()
export class GameUserResponseDto {
  @Expose()
  userId: number;

  @Expose()
  gameId: number;

  @Expose()
  playerNumbers: number[];

  @Type(() => UserResponse)
  @Expose() // also the @Expose()
  user: UserResponse;
}
