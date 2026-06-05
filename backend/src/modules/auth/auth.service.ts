import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const roles = user.roles.map((ur: any) => ur.role.code);
    const permissions = [
      ...new Set(
        user.roles.flatMap((ur: any) =>
          ur.role.permissions.map((rp: any) => rp.permission.code),
        ),
      ),
    ] as string[];

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
        permissions,
      },
    };
  }
}
