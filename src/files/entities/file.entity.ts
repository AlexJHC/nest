import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avatars')
class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default File;
