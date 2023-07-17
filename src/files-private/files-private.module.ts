import { Module } from '@nestjs/common';
import { FilesPrivateService } from './files-private.service';
import PrivateFile from './entities/private-files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateFile])],
  providers: [FilesPrivateService],
  exports: [FilesPrivateService],
})
export class FilesPrivateModule {}
