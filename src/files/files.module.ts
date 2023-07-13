import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import File from './entities/file.entity';

@Module({
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([File])],
  exports: [FilesService],
})
export class FilesModule {}
