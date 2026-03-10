export interface IRequestOptions {
  baseURL: string;
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: object;
  headers?: Record<string, string>;
}

export interface IResponse<T extends object | null> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export interface IResponseFields {
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export type SortDirection = 'asc' | 'desc';

export type CustomersSortField = 'createdOn' | 'email' | 'name' | 'country';

export type ProductsSortField = 'createdOn' | 'price' | 'name' | 'manufacturer';

export type OrdersSortField = 'createdOn' | 'status' | '_id' | 'email' | 'price' | 'delivery' | 'assignedManager';

export interface ILoginResponseBody extends IResponseFields {
  User: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    roles: string[];
    createdOn: string;
  };
}
