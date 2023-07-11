import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EditUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: EditUserDto,
  ): Promise<any> {
    return this.userService.editUser(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Get('me')
  async my(@Request() req): Promise<User> {
    return this.userService.me(req.user.sub);
  }
}
