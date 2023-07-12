import { IsString, Length } from 'class-validator';

export class AuthRegistrationDto {
  @IsString()
  @Length(5, 15, {
    message:
      'The password must be at least 5 but not longer than 15 characters',
  })
  readonly oldPassword: string;
  @IsString()
  @Length(5, 15, {
    message:
      'The password must be at least 5 but not longer than 15 characters',
  })
  readonly newPassword: string;
  @IsString()
  @Length(5, 15, {
    message:
      'The password must be at least 5 but not longer than 15 characters',
  })
  readonly confirmPassword: string;
}
