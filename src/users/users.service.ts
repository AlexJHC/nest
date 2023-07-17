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

  async getAllUsers(page = 1, perPage = 50) {
    const skip = (page - 1) * perPage;

    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.country', 'ASC')
      .offset(skip)
      .limit(perPage)
      .getMany();
  }

  async getUsersByCountries(): Promise<{ [country: string]: number }> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.country', 'ASC')
      .getMany();

    return users.reduce((groupedUsers, user) => {
      if (!groupedUsers[user.country]) {
        groupedUsers[user.country] = 0;
      }
      ++groupedUsers[user.country];
      return groupedUsers;
    }, {});
  }

  async getUsersBySubscribers(subscribers: number): Promise<Users[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.country', 'ASC')
      .where('user.subscribers = :subscribers', { subscribers })
      .getMany();
  }

  async getUsersBySubscribersCountry(
    subscribers: number,
    country: EUsersCountry,
  ): Promise<Users[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.country', 'ASC')
      .where('user.subscribers = :subscribers', { subscribers })
      .andWhere('user.country = :country', { country })
      .getMany();
  }

  async findUserPostsByBodyText(bodyText: string): Promise<Posts[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('post.body LIKE :bodyText', { bodyText: `%${bodyText}%` })
      .getMany();
  }

  async countUserPostsByBodyText(bodyText: string): Promise<any> {
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('post.body LIKE :bodyText', { bodyText: `%${bodyText}%` })
      .getMany();

    return posts.reduce((groupedUsers, post) => {
      if (!groupedUsers[post.user.country]) {
        groupedUsers[post.user.country] = 0;
      }
      ++groupedUsers[post.user.country];
      return groupedUsers;
    }, {});
  }
}
