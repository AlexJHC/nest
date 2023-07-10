import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex@email.fl', description: 'user email' })
  readonly email: string;
  @ApiProperty({ example: 'Alex', description: 'user name' })
  readonly name: string;
  @ApiProperty({ example: '12312dawdawq', description: 'user password' })
  readonly password: string;
}
