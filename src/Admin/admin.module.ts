import { Module } from '@nestjs/common';
import { Admin } from './admin.entity';
import { adminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';

@Module({
    imports:[TypeOrmModule.forFeature([Admin])],
    controllers: [adminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule {

    
}
