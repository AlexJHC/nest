import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EUsersCountry } from '../common/models/users';

@ApiTags('Query Builder')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('count')
  async count(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<Users[]> {
    return this.usersService.getAllUsers(page, perPage);
  }

  @Get('count/countries')
  async countryCount() {
    return this.usersService.getUsersByCountries();
  }

  @Get('subscribers')
  async subscribersCount(@Query('subscribers') subscribers: number) {
    return this.usersService.getUsersBySubscribers(subscribers);
  }

  @Get('countries/subscribers')
  @ApiQuery({ name: 'country', enum: EUsersCountry })
  async subscribersCountryCount(
    @Query('subscribers') subscribers: number,
    @Query('country') country: EUsersCountry,
  ) {
    return this.usersService.getUsersBySubscribersCountry(subscribers, country);
  }

  @Get('user-posts')
  async findUserPostsByBodyText(@Query('bodyText') bodyText: string) {
    return this.usersService.findUserPostsByBodyText(bodyText);
  }

  @Get('count/posts-country')
  async countUserPostsByBodyText(@Query('bodyText') bodyText: string) {
    return this.usersService.countUserPostsByBodyText(bodyText);
  }
}
