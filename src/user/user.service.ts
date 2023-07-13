import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserUpdateDto } from './dto/user-update.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(dto: UserUpdateDto, id: number): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });
    return this.userRepository.save({
      ...user,
      name: dto.name,
      email: dto.email,
    });
  }

  async findOneOrFail(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async upload(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    const user = await this.findOneOrFail(userId);
    await this.userRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.findOneOrFail(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }
}
