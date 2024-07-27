import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WinningCombinationService } from '../services/winning-combination.service';
import { CreateWinningCombinationDto } from '../dtos/create-winning-combination.dto';
import { UpdateWinningCombinationDto } from '../dtos/update-winning-combination.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('winning-combinations')
@Controller('winning-combinations')
export class WinningCombinationController {
  constructor(
    private readonly winningCombinationService: WinningCombinationService,
  ) {}

  @Post()
  create(@Body() createWinningCombinationDto: CreateWinningCombinationDto) {
    return this.winningCombinationService.create(createWinningCombinationDto);
  }

  @Get()
  findAll() {
    return this.winningCombinationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.winningCombinationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWinningCombinationDto: UpdateWinningCombinationDto,
  ) {
    return this.winningCombinationService.update(
      +id,
      updateWinningCombinationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.winningCombinationService.remove(+id);
  }
}
