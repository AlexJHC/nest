import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
  providers: [RegistrationService],
  controllers: [RegistrationController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class RegistrationModule {}
