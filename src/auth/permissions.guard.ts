import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, PERMISSIONS_KEY } from './permissions.decorator';



@Injectable()
export class RolesGuard implements CanActivate {


  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(PERMISSIONS_KEY, context.getHandler());
    if (!requiredPermissions) {
      return true; // No roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('Required permissions:', requiredPermissions);
    console.log('User permssion:', user.Permission);
    
    const hasPermission = requiredPermissions.every(permission=>user.Permissions.include(permission))
    console.log('Has required Permission:', hasPermission);
    
    return hasPermission;
  }
}