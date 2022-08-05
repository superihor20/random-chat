import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: true,
  })
  username: string;

  @Column({
    length: 100,
  })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  background: string;
}
