export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(params: { page: number; pageSize: number; keyword?: string }): Promise<{ data: any[]; total: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  getUserWithRolesAndPermissions(userId: string): Promise<any>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
