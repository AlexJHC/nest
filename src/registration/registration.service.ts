import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../user/dto/user.dto';
import { hashPassword } from '../util/user';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async registration(dto: UserDto): Promise<User> {
    const hashPass = await hashPassword(dto.password);
    return this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: hashPass,
    });
  }
}
