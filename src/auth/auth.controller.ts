import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() dto: signInDto) {
    return this.authService.signIn(dto);
  }
}
