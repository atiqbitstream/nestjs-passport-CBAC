
import { Controller, Get,Request, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionsGuard } from './auth/permissions.guard';
import { Permission } from './auth/permissions.decorator';
import { Permissions } from './auth/permissions.decorator';




@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService:AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Permissions(Permission.GENERAL_ADMIN_PERMISSION)
  @Get('admin-only')
  adminOnly() {
    return 'This is an admin-only route';
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Permissions(Permission.GENERAL_USER_PERMISSION)
  @Get('user-only')
  userOnly() {
    return 'This is a user-only route';
  }

  @UseGuards(JwtAuthGuard,PermissionsGuard)
  @Permissions(Permission.GENERAL_ADMIN_PERMISSION, Permission.GENERAL_USER_PERMISSION)
  @Get('admin-or-user')
  adminOrUser() {
    return 'This route can be accessed by both admin and user';
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
