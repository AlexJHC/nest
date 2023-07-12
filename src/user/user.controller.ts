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
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async my(@Request() req): Promise<User> {
    return this.userService.me(req.user.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UserUpdateDto,
    @Request() req,
  ): Promise<any> {
    return this.userService.editUser(id, dto, req.user.sub);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req): Promise<void> {
    return this.userService.deleteUser(id, req.user.sub);
  }
}
