import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RrsStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const { email, rrs_id, rrs_token } = req.body;
    console.log('RrsStrategy validate:', { email, rrs_id, rrs_token });

    const user = await this.authService.validateUser(email, rrs_id, rrs_token);

    if (!user) {
      console.log('User not found, throwing UnauthorizedException');
      throw new UnauthorizedException();
    }
    return user;
  }
}
