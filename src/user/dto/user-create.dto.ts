import { IsEmail, IsString, Length } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(2, 15, {
    message: 'The name must be at least 2 but not longer than 15 characters',
  })
  readonly name: string;
  @IsString()
  @Length(5, 15, {
    message:
      'The password must be at least 5 but not longer than 15 characters',
  })
  readonly password: string;
}
