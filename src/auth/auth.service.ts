import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    rss_id: string,
    rss_token: string,
  ): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    // Compare rss_id and rss_token
    if (user && user.rrs_id === rss_id && user.rrs_token === rss_token) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: { userId: user.id },
    };

    delete user.password;

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d', // refresh token expiry
    });

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: { userId: user.id },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
