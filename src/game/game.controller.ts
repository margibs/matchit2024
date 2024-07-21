import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateGameUserDto } from './dto/create-game-user.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Post('player-number-pick')
  playerNumberPick(@Body() createGameUserDto: CreateGameUserDto) {
    return this.gameService.createPlayerNumberPick(createGameUserDto);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get('/current')
  getActiveGames() {
    return this.gameService.activeGames();
  }

  @Get('/user-game/:id')
  getUserGame(@Param('id') id: string) {
    return this.gameService.getUserGame(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
