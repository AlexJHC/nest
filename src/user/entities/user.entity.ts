import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from '../../posts/entities/post.entity';
import File from '../../files/entities/file.entity';
import PrivateFile from '../../files-private/entities/private-files.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false })
  isValid: boolean;

  @JoinColumn()
  @OneToOne(() => File, {
    eager: true,
    nullable: true,
  })
  public avatar?: File;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[];
}
