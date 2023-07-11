import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/post.dto';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async createPost(@Body() dto: CreatePostDto, @Request() req) {
    return this.postsService.createPost(dto, {
      id: req.user.sub,
    });
  }

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: number) {
    return this.postsService.getPost(id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() dto: CreatePostDto,
    @Request() req,
  ) {
    return this.postsService.updatePost(id, dto, req.user.sub);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number, @Request() req) {
    return this.postsService.deletePost(id, req.user.sub);
  }
}
