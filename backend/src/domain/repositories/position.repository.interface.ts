export interface IPositionRepository {
  findAll(filters: any): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}

export const POSITION_REPOSITORY = Symbol('POSITION_REPOSITORY');
