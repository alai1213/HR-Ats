export interface ICandidateRepository {
  findAll(filters: any): Promise<{ data: any[]; total: number }>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
  batchUpdate(ids: string[], data: any): Promise<number>;
}

export const CANDIDATE_REPOSITORY = Symbol('CANDIDATE_REPOSITORY');
