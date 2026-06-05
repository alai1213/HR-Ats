import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  const mockUserRepo = {
    findByEmail: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'test@company.com',
      name: 'Test User',
      passwordHash: 'hashed',
      isActive: true,
      roles: [
        {
          role: {
            code: 'HR',
            permissions: [{ permission: { code: 'candidate:read:all' } }],
          },
        },
      ],
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('test@company.com', 'password');

    expect(result.accessToken).toBe('mock-token');
    expect(result.user.email).toBe('test@company.com');
    expect(result.user.roles).toContain('HR');
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'test@company.com',
      passwordHash: 'hashed',
      isActive: true,
      roles: [],
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('test@company.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
