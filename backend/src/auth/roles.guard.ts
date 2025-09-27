import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RequestWithUser } from '../auth/types/request-with-user.type'; // <-- new import

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // no roles required

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<RequestWithUser>(); // <-- typed request
    const user = req.user;

    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
