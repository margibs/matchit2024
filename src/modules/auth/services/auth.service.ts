import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { UserCreationDto } from 'src/modules/user/dtos/user-creation.dto';
import { Timezone } from 'src/modules/user/entities/timezone.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(Timezone)
    private readonly timezoneRepository: Repository<Timezone>,
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

  async register(createUserDto: CreateUserDto) {
    const password =
      createUserDto.password ||
      `${createUserDto.rrs_token}${this.configService.get('PASSWORD_GEN_SECRET')}`;

    const timezone = await this.timezoneRepository.findOne({
      where: { name: createUserDto.timezoneName },
    });

    if (!timezone) {
      throw new NotFoundException(
        `Timezone ${createUserDto.timezoneName} not found`,
      );
    }

    const userCreationDto = new UserCreationDto();
    Object.assign(userCreationDto, createUserDto);
    userCreationDto.password = password;
    userCreationDto.timezone = timezone;
    const user = await this.userService.create(userCreationDto);
    return this.login(user);
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
