import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { UserCreateDto } from '../user/dto/user-create.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() dto: AuthSignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('registration')
  create(@Body() userDto: UserCreateDto): Promise<User> {
    return this.authService.registration(userDto);
  }

  @Patch('password')
  async changePassword(
    @Body() dto: AuthRegistrationDto,
    @Request() { user },
  ): Promise<any> {
    return this.authService.changeUserPassword(dto, user.sub);
  }

  // @Get('token')
  // async getToken() {
  //   return this.authService.emailConfirmation();
  // }
}
