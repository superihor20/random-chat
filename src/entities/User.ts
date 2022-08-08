import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  banner: string;
}
