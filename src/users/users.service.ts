import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    await this.userRepository.save(user);
    return user;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
}
