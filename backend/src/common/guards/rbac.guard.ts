import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from '../decorators/current-user.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const authUser = user as AuthUser;

    if (requiredRoles?.length) {
      const hasRole = requiredRoles.some((role) => authUser.roles.includes(role));
      if (!hasRole) {
        throw new ForbiddenException('权限不足：角色不匹配');
      }
    }

    if (requiredPermissions?.length) {
      const hasPermission = requiredPermissions.some((perm) =>
        authUser.permissions.includes(perm),
      );
      if (!hasPermission) {
        throw new ForbiddenException('权限不足：缺少必要权限');
      }
    }

    return true;
  }
}
