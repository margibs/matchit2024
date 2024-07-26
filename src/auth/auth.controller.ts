import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RrsAuthGuard } from './guards/rrs.auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RrsAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register() {}

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    console.debug(req.user);
    return await this.authService.refreshToken(req.user);
  }
}
