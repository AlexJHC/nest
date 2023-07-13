import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Avatars')
class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default File;
