import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './create-Admin.dto';



@Controller('admin')
export class adminController {
  constructor(private readonly adminService: AdminService) {}


  @Post('signup')
  create(@Body() createAdminDto: CreateAdminDto) {
    
    return this.adminService.create(createAdminDto);
  }
}