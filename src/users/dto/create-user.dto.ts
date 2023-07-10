import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   * Email
   * @example test@test.ru
   */
  readonly email: string;

  /**
   *
   * @example [Alex, Antton]
   */
  readonly name: string;

  readonly password: string;
}
