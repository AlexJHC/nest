import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async findOneBy(@Request() { user }): Promise<User> {
    return this.userService.findOneBy(user.sub);
  }

  @Put()
  async update(@Body() dto: UserUpdateDto, @Request() { user }): Promise<any> {
    return this.userService.update(dto, user.sub);
  }

  @Delete()
  async delete(@Request() { user }): Promise<void> {
    return this.userService.delete(user.sub);
  }
}
