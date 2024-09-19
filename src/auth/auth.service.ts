import { UsersService } from './../users/users.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/Admin/admin.service';

@Injectable()
export class AuthService {

constructor(private userService:UsersService, private jwtService: JwtService, private adminService:AdminService){}

async validateUser(username: string, password: string): Promise<any> {
  // First, try to find the user in the user repository
  const user = await this.userService.findOne(username);
  if (user && await bcrypt.compare(password, user.password)) {
    const { password, ...result } = user;

     return result
  }

  // If no user is found, try the admin repository
  const admin = await this.adminService.findOne(username);
  if (admin && await bcrypt.compare(password, admin.password)) {
    const { password, ...result } = admin;
    return result;
  }

  // If neither user nor admin is found
  return null;
}

  async login(user: any) {
   
    return {
      access_token: await this.generateAccessToken(user),
      refresh_token:await this.generateRefreshToken(user)
    };
  }

  async generateAccessToken(user:any)
  {
    const payload = { username: user.username, sub: user.userId, role: user.role };
    return  this.jwtService.sign(payload,{ expiresIn: '60s' });
  }

  async generateRefreshToken(user:any)
  {
    const payload = { username: user.username, sub: user.userId, role:user.roles };
    return  this.jwtService.sign(payload,{ expiresIn: '7d' });
    }

    async validateRefreshToken(token: string): Promise<any> {
      try {
        const payload = this.jwtService.verify(token);
        const user = await this.userService.findOne(payload.username);
        if (user) {
          return { ...user, token };
        }
      } catch (error) {
        return null;
      }
    }
  }


