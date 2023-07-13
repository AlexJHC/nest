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
import { EmailsService } from '../common/services/email.service';
import { emailTemplate } from '../common/util/emailTemplate';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailsService: EmailsService,
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
    const user = await this.userRepository.save({
      email: dto.email,
      name: dto.name,
      password: hashPass,
    });
    const payload = { id: user.id, username: user.name };
    await this.sendEmail(payload);
    return user;
  }

  async changeUserPassword(dto: AuthRegistrationDto, id: number) {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    const hashPass = await hashPassword(dto.newPassword);
    if (!isMatch) {
      throw new NotFoundException('old password not match');
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new NotFoundException('confirm password not match to password');
    }
    await this.userRepository.update(id, { password: hashPass });
  }

  async sendEmail(payload: { id: number; username: string }) {
    const { email } = await this.userRepository.findOneOrFail({
      where: { id: payload.id },
    });

    const token = this.jwtService.sign(payload, { expiresIn: '24h' });
    const emailObj = {
      message: emailTemplate(payload.username, token),
      subject: 'Email verification',
      recipient: email,
    };
    await this.emailsService.sendEmail(emailObj);
  }

  async confirmEmail(token: string) {
    const { id } = this.jwtService.verify(token);
    await this.userRepository.findOneOrFail({ where: { id } });
    return this.userRepository.update(id, { isValid: true });
  }
}
