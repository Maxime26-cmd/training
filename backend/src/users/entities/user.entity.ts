/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from 'typeorm';
import { Location } from '../../location/entities/location.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @Column({ nullable: true })
  profilePicture: string;


  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];
}
