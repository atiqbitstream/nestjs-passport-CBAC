import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string; 

  @Column({ default: 'admin' }) // Default role is 'user'
  role: string;

  @Column({ default: true })
  isActive: boolean;
}