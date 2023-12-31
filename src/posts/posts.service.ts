import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(dto: PostCreateDto, author: { id: number }): Promise<Post> {
    return this.postRepository.save({
      ...dto,
      author,
    });
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      select: { author: { name: true } },
    });
  }

  async findOneOrFail(id: number) {
    return this.postRepository.findOneOrFail({
      where: { id },
      select: {
        author: { name: true },
      },
      relations: ['author'],
    });
  }

  async update(id: number, dto: PostCreateDto, userID: number) {
    await this.postRepository.findOneOrFail({
      where: { id, author: { id: userID } },
    });

    return this.postRepository.update(id, {
      body: dto.body,
    });
  }

  async delete(id: number, userID: number) {
    await this.postRepository.findOneOrFail({
      where: { id, author: { id: userID } },
    });
    await this.postRepository.delete(id);
  }
}
