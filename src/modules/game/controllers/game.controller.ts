import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';

import { User } from 'src/modules/user/entities/user.entity';
import { GameService } from '../services/game.service';
import { CreateGameDto } from '../dtos/create-game.dto';
import { CreateGameUserDto } from '../dtos/create-game-user.dto';
import { UpdateGameDto } from '../dtos/update-game.dto';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto, @CurrentUser() user: User) {
    return this.gameService.create(createGameDto, user);
  }

  @Post('player-number-pick')
  createPlayerNumberPick(
    @Body() createGameUserDto: CreateGameUserDto,
    @CurrentUser() user: User,
  ) {
    return this.gameService.createPlayerNumberPick(createGameUserDto, user);
  }

  @Post('save-draw/:id')
  createPlayerDraw(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.gameService.createPlayerDraw(id, user);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get('/current')
  getActiveGames(@CurrentUser() user: User) {
    return this.gameService.activeGames(user);
  }

  @Get('/user-game/:id')
  getUserGame(@Param('id') id: string, @CurrentUser() user: User) {
    return this.gameService.getUserGame(+id, user);
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
