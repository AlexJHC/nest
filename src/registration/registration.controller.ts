import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/user.entity';
import { RegistrationService } from './registration.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Post()
  create(@Body() userDto: UserDto): Promise<User> {
    return this.registrationService.registration(userDto);
  }
}
