import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { EUsersCountry } from '../common/models/users';
import { Posts } from './entities/posts.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  getQueryUser() {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.country', 'ASC');
  }

  getQueryPost() {
    return this.postsRepository.createQueryBuilder('post');
  }

  async getAllUsers(page = 1, perPage = 50) {
    const skip = (page - 1) * perPage;

    return this.getQueryUser().offset(skip).limit(perPage).getMany();
  }

  async getUsersByCountries() {
    return this.getQueryUser()
      .select('user.country', 'country')
      .addSelect('COUNT(user.id)', 'userCount')
      .groupBy('user.country')
      .getRawMany();
  }

  async getUsersBySubscribers(subscribers: number) {
    return this.getQueryUser()
      .where('user.subscribers = :subscribers', { subscribers })
      .getMany();
  }

  async getUsersBySubscribersCountry(
    subscribers: number,
    country: EUsersCountry,
  ): Promise<Users[]> {
    return this.getQueryUser()
      .where('user.subscribers = :subscribers', { subscribers })
      .andWhere('user.country = :country', { country })
      .getMany();
  }

  async findUserPostsByBodyText(bodyText: string) {
    return this.getQueryPost()
      .innerJoinAndSelect('post.user', 'user')
      .where('post.body LIKE :bodyText', { bodyText: `%${bodyText}%` })
      .getMany();
  }

  async countUserPostsByBodyText(bodyText: string) {
    return this.getQueryPost()
      .innerJoinAndSelect('post.user', 'user')
      .where('post.body LIKE :bodyText', { bodyText: `%${bodyText}%` })
      .select('user.country', 'country')
      .addSelect('COUNT(user.id)', 'userCount')
      .groupBy('user.country')
      .getRawMany();
  }
}
