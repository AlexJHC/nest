import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './posts.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  subscribers: number;

  @OneToMany(() => Posts, (post: Posts) => post.user)
  public posts: Posts[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
