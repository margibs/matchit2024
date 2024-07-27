import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RrsAuthGuard } from '../guards/rrs.auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.auth.guard';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { LoginUserResponseDto } from '../dtos/login-user-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RrsAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginUserResponseDto> {
    const loginUser = await this.authService.login(req.user);
    return plainToInstance(LoginUserResponseDto, loginUser);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    console.debug(req.user);
    return await this.authService.refreshToken(req.user);
  }
}
