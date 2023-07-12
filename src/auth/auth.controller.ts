import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordUserDto, UserDto } from '../user/dto/user.dto';
import { User } from '../user/user.entity';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() dto: signInDto) {
    return this.authService.signIn(dto);
  }

  @Post('registration')
  create(@Body() userDto: UserDto): Promise<User> {
    return this.authService.registration(userDto);
  }

  @Patch('password/:id')
  async changePassword(
    @Param('id') id: number,
    @Body() dto: ChangePasswordUserDto,
    @Request() req,
  ): Promise<any> {
    return this.authService.changeUserPassword(id, dto, req.user.sub);
  }
}
