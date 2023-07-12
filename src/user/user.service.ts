import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async deleteUser(id: number, userID: number): Promise<void> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    const sameUser = Number(id) === userID;
    if (!user) {
      throw new NotFoundException('wrong user id');
    }
    if (!sameUser) {
      throw new NotFoundException('no permission');
    }
    await this.userRepository.delete(userID);
  }

  async editUser(
    id: number,
    dto: UserUpdateDto,
    userID: number,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const sameUser = Number(id) === userID;
    if (!user) {
      throw new NotFoundException('wrong user id');
    }
    if (!sameUser) {
      throw new NotFoundException('no permission');
    }
    return this.userRepository.save({
      ...user,
      name: dto.name,
      email: dto.email,
    });
  }

  async me(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
