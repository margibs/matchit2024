import { PartialType } from '@nestjs/swagger';
import { CreateWinningCombinationDto } from './create-winning-combination.dto';

export class UpdateWinningCombinationDto extends PartialType(CreateWinningCombinationDto) {}
