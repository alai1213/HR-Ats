import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { AuthUser } from '@/common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', 'hr-ats-secret-key'),
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<AuthUser> {
    const user = await this.userRepo.getUserWithRolesAndPermissions(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('用户不存在或已禁用');
    }

    const roles = user.roles.map((ur: any) => ur.role.code);
    const permissions = [
      ...new Set(
        user.roles.flatMap((ur: any) =>
          ur.role.permissions.map((rp: any) => rp.permission.code),
        ),
      ),
    ] as string[];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
    };
  }
}
