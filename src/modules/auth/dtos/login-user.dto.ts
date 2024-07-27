import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  rss_id: string;

  @IsString()
  @IsNotEmpty()
  rss_token: string;
}
