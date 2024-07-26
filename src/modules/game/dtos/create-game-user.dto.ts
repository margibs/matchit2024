import { IsArray, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameUserDto {
  @IsNumber()
  @IsNotEmpty()
  gameId: number;

  @IsArray()
  @IsNotEmpty()
  playerNumbers: number[];

  @IsBoolean()
  @IsNotEmpty()
  isPlayerNumberChosen: boolean;
}
