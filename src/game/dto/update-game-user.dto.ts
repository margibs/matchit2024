import { PartialType } from '@nestjs/swagger';
import { CreateGameUserDto } from './create-game-user.dto';

export class UpdateGameUserDto extends PartialType(CreateGameUserDto) {}
