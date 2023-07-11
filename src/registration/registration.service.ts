import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async registration(dto: UserDto): Promise<User> {
    const saltOrRounds = 6;
    const hashPass = await bcrypt.hash(dto.password, saltOrRounds);
    const user = await this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: hashPass,
    });
    return user;
  }
}
