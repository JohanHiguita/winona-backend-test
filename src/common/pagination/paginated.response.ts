export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function toPaginatedResponse<T>(args: {
  data: T[];
  page: number;
  limit: number;
  total: number;
}): PaginatedResponse<T> {
  const totalPages = Math.max(1, Math.ceil(args.total / args.limit));
  return {
    data: args.data,
    page: args.page,
    limit: args.limit,
    total: args.total,
    totalPages,
  };
}

