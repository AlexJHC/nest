import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPost(dto: CreatePostDto, author: { id: number }): Promise<Post> {
    const newPost = await this.postRepository.create({
      ...dto,
      author,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      select: { author: { name: true } },
    });
  }

  async getPost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      select: {
        author: { name: true },
      },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    return post;
  }

  async updatePost(id: number, dto: CreatePostDto, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id, author: { id: userId } },
    });
    if (!post) {
      throw new NotFoundException('post does not exist or no permission');
    }
    await this.postRepository.update(id, {
      body: dto.body,
    });
  }

  async deletePost(id: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id, author: { id: userId } },
    });
    if (!post) {
      throw new NotFoundException('post does not exist or no permission');
    }
    await this.postRepository.delete(post);
  }
}
