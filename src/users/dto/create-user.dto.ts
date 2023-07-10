export class CreateUserDto {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

export class EditUserDto {
  readonly name: string;
  readonly email: string;
}
