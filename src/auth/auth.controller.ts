import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RrsAuthGuard } from './guards/rrs.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RrsAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // return 'yeah boi';
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register() {}
}
