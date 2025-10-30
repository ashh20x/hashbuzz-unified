export * from './auth';
export * from './balances';
export * from './campaign';
export * from './forms';
export * from './quest';
export * from './state';
export * from './token';
export * from './transaction';
export * from './users';

export interface PaginatedQueryResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
