import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { EditUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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

  async me(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
}
