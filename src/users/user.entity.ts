import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string; 

  @Column({ default: 'user' }) // Default role is 'user'
  role: string;

  @Column({ default: true })
  isActive: boolean;
}