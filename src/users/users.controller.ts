import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, EditUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users.entity';

@ApiTags('Users')
@Controller('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: EditUserDto,
  ): Promise<any> {
    return this.userService.editUser(id, dto);
  }

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }
}
