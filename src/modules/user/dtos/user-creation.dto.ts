import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsObject } from 'class-validator';
import { Timezone } from '../entities/timezone.entity';

export class UserCreationDto extends OmitType(CreateUserDto, [
  'timezoneName',
] as const) {
  @IsNotEmpty()
  @IsObject()
  timezone: Timezone;
}
