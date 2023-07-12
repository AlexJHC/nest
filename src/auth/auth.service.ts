import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { signInDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordUserDto, UserDto } from '../user/dto/user.dto';
import { hashPassword } from '../util/user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: signInDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registration(dto: UserDto): Promise<User> {
    const hashPass = await hashPassword(dto.password);
    return this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: hashPass,
    });
  }

  async changeUserPassword(
    id: number,
    dto: ChangePasswordUserDto,
    userID: number,
  ) {
    const sameUser = Number(id) === userID;
    const user = await this.userRepository.findOneBy({ id });
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    const hashPass = await hashPassword(dto.newPassword);
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
