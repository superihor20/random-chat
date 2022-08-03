import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  username: string;

  @Column({
    length: 100,
  })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column()
  avatar: string;

  @Column()
  background: string;
}
