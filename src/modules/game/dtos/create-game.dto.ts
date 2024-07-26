import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  // This will determine how many times the number picking repeats.
  randomRepeatAllowed: number;

  @IsNumber()
  @IsNotEmpty()
  // Game duration in days
  duration: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsDateString()
  @IsNotEmpty()
  pickingDate: Date;

  @IsEnum(['random', 'sequential'])
  @IsNotEmpty()
  boardPosition: 'random' | 'sequential';

  @IsNumber()
  @IsNotEmpty()
  // How many numbers can a user picks inside a pattern
  numberPicking: number;

  @IsNumber()
  @IsNotEmpty()
  // Number picking in hours
  numberPickFrequency: number;
}
