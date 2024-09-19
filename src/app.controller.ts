
import { Controller, Get,Request, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/permissions.guard';
import { Roles } from './auth/permissions.decorator';
import { Role } from './auth/roles.enum';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService:AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('admin')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  async refreshToken(@Body('refresh_token') refresh_token: string) {
    const validUser = await this.authService.validateRefreshToken(refresh_token);
    if (!validUser) {
      return { statusCode: 401, message: 'Invalid refresh token' };
    }
    return {
      access_token:await this.authService.generateAccessToken(validUser),
    };
  }
}
