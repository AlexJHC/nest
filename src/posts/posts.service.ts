import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: { id: number }): Promise<Post> {
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

  async update(id: number, dto: CreatePostDto, userId: number) {
    const post = await this.postRepository.findOneOrFail({
      where: { id, author: { id: userId } },
    });
    post &&
      (await this.postRepository.update(id, {
        body: dto.body,
      }));
  }

  async delete(id: number, userId: number) {
    const post = await this.postRepository.findOneOrFail({
      where: { id, author: { id: userId } },
    });
    post && (await this.postRepository.delete(post));
  }
}
