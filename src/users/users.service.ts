import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return await this.userRepository.remove(user);
  }

  async editUser(id: number, dto: EditUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return await this.userRepository.save({
      ...user,
      name: dto.name,
      email: dto.email,
    });
  }

  // Test one
  async getAllUsers() {
    return await this.userRepository.find();
  }
}
