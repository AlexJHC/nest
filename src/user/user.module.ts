import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FilesModule } from '../files/files.module';
import { FilesPrivateModule } from '../files-private/files-private.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), FilesModule, FilesPrivateModule],
})
export class UserModule {}
