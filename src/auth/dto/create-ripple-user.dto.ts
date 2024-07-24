import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRippleUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  rrs_id: string;

  @IsString()
  @IsNotEmpty()
  rrs_token: string;
}
