import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ChangePasswordUserDto, EditUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

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

  async editUser(id: number, dto: EditUserDto, userID: number): Promise<User> {
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

  async changeUserPassword(
    id: number,
    dto: ChangePasswordUserDto,
    userID: number,
  ) {
    const sameUser = Number(id) === userID;
    const user = await this.userRepository.findOneBy({ id });
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    const saltOrRounds = 6;
    const hashPass = await bcrypt.hash(dto.newPassword, saltOrRounds);
    if (!user) {
      throw new NotFoundException('wrong user id');
    }
    if (!sameUser) {
      throw new NotFoundException('no permission');
    }
    if (!isMatch) {
      throw new NotFoundException('old password not match');
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new NotFoundException('confirm password not match to password');
    }
    await this.userRepository.update(id, { password: hashPass });
  }
}
