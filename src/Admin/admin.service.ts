import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './create-Admin.dto';
import * as bcrypt from 'bcrypt';
import { Admin } from './Admin.entity';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Admin)
        private AdminsRepository: Repository<Admin>,
      ) {}
      
      async findOne(username:string):Promise<Admin | undefined>
      {
        return this.AdminsRepository.findOne({where : {username}})
      }

      async create(AdminDto:CreateAdminDto):Promise<Admin>
      {
        const salt = await bcrypt.genSalt();
        console.log("hi i am salt here : ",salt)
        const hashedPassword = await bcrypt.hash(AdminDto.password, salt);
        const Admin = this.AdminsRepository.create({...AdminDto,password:hashedPassword})
        return this.AdminsRepository.save(Admin);
      }
}

