import { OmitType } from '@nestjs/swagger';
import { UserCreateDto } from '../../user/dto/user-create.dto';

export class AuthSignInDto extends OmitType(UserCreateDto, ['name'] as const) {}
