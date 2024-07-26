import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserDto } from '../dtos/update-user.dto';

import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreationDto } from '../dtos/user-creation.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(userCreationDto: UserCreationDto) {
    const user = this.userRepository.create(userCreationDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      relations: ['timezone'],
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
