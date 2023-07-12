import { UserCreateDto } from './user-create.dto';
import { OmitType } from '@nestjs/swagger';

export class UserUpdateDto extends OmitType(UserCreateDto, [
  'password',
] as const) {}
