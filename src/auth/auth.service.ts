import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
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
      sub: user.id,
    };

    delete user.password;

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
