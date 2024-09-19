import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from './roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {


  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('Required roles:', requiredRoles);
    console.log('User role:', user.role);
    
    const hasRole = requiredRoles.includes(user.role);
    console.log('Has required role:', hasRole);
    
    return hasRole;
  }
}