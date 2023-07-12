import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(dto: UserUpdateDto, id: number): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });
    return this.userRepository.save({
      ...user,
      name: dto.name,
      email: dto.email,
    });
  }

  async findOneBy(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
