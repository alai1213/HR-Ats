import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { paginate } from '@/common/dto/pagination.dto';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    private prisma: PrismaService,
  ) {}

  async findAll(query: QueryUserDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { data, total } = await this.userRepo.findAll({ ...query, page, pageSize });
    return paginate(
      data.map(({ passwordHash, ...user }: any) => user),
      total,
      page,
      pageSize,
    );
  }

  async findOne(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('用户不存在');
    const { passwordHash, ...result } = user;
    return result;
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { roleIds, password, ...rest } = dto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
        roles: roleIds?.length
          ? { create: roleIds.map((roleId) => ({ roleId })) }
          : undefined,
      },
      include: { roles: { include: { role: true } } },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    const { roleIds, password, ...rest } = dto;
    const data: any = { ...rest };

    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    if (roleIds) {
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      data.roles = { create: roleIds.map((roleId) => ({ roleId })) };
    }

    const user = await this.userRepo.update(id, data);
    const { passwordHash, ...result } = user;
    return result;
  }

  async resetPassword(id: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    await this.userRepo.update(id, { passwordHash });
    return { message: '密码已重置' };
  }
}
