import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Post,
  Param,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { ApiFile } from '../common/util/ApiFile';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async findOneBy(@Request() { user }): Promise<User> {
    return this.userService.findOneOrFail(user.sub);
  }

  @Put()
  async update(@Body() dto: UserUpdateDto, @Request() { user }): Promise<any> {
    return this.userService.update(dto, user.sub);
  }

  @Delete()
  async delete(@Request() { user }): Promise<void> {
    return this.userService.delete(user.sub);
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Request() { user }, @UploadedFile() file: Express.Multer.File) {
    return this.userService.upload(user.sub, file.buffer, file.originalname);
  }

  @Delete('avatar')
  async deleteAvatar(@Request() { user }): Promise<void> {
    return this.userService.deleteAvatar(user.sub);
  }

  @Post('files')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() { user },
  ) {
    return this.userService.addPrivateFile(
      user.sub,
      file.buffer,
      file.originalname,
    );
  }

  @Get('files/:id')
  async getPrivateFile(
    @Request() { user },
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const file = await this.userService.getPrivateFile(user.sub, id);
    file.stream.pipe(res);
  }

  @Get('files')
  async getAllPrivateFiles(@Request() { user }) {
    return this.userService.getAllPrivateFiles(user.sub);
  }
}
