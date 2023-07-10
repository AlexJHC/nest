import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'unique number' })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  @ApiProperty({ example: 'Alex', description: 'user name' })
  @Column()
  name: string;
  @ApiProperty({ example: 'Alex@email.fl', description: 'user email' })
  @Column()
  email: string;
  @ApiProperty({ example: '12312dawdawq', description: 'user password' })
  @Column()
  password: string;
}
