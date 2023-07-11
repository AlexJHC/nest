import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 100, {
    message: 'The name must be at least 1 but not longer than 100 characters',
  })
  readonly body: string;
}
