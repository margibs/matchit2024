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
import { GameUserResponseDto } from '../dtos/game-user-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto, @CurrentUser() user: User) {
    return this.gameService.create(createGameDto, user);
  }

  @Post('player-number-pick')
  async createPlayerNumberPick(
    @Body() createGameUserDto: CreateGameUserDto,
    @CurrentUser() user: User,
  ): Promise<GameUserResponseDto> {
    const gameUser = this.gameService.createPlayerNumberPick(
      createGameUserDto,
      user,
    );
    return plainToInstance(GameUserResponseDto, gameUser);
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
