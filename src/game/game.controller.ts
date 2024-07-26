import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateGameUserDto } from './dto/create-game-user.dto';
import { UpdateGameUserDto } from './dto/update-game-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Post('player-number-pick')
  createPlayerNumberPick(
    @Body() createGameUserDto: CreateGameUserDto,
    @CurrentUser() user: User,
  ) {
    return this.gameService.createPlayerNumberPick(createGameUserDto, user);
  }

  @Post('save-draw')
  createPlayerDraw(
    @Body() updateGameUserDto: UpdateGameUserDto,
    @CurrentUser() user: User,
  ) {
    return this.gameService.createPlayerDraw(updateGameUserDto, user);
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
