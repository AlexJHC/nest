import { IsEmail, IsString, Length } from 'class-validator';

export class signInDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(5, 15, {
    message:
      'The password must be at least 5 but not longer than 15 characters',
  })
  readonly password: string;
}
