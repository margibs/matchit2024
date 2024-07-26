import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RrsAuthGuard } from '../guards/rrs.auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.auth.guard';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RrsAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
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
