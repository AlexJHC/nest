import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { hashPassword } from '../common/util/hashPassword';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { UserCreateDto } from '../user/dto/user-create.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: AuthSignInDto): Promise<{ access_token: string }> {
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

  async registration(dto: UserCreateDto): Promise<User> {
    const hashPass = await hashPassword(dto.password);
    return this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: hashPass,
    });
  }

  async changeUserPassword(
    id: number,
    dto: AuthRegistrationDto,
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
