import { COUNTRIES } from 'data/customers/countries.data';
import { customersSortField, IResponseFields, sortDirection } from './api.types';

export interface ICustomer {
  email?: string;
  name: string;
  country: COUNTRIES;
  city: string;
  street: string;
  house: number;
  flat: number;
  phone: string;
  notes?: string;
  role?: string;
}

export type ICustomerInTable = Pick<ICustomer, 'email' | 'country' | 'name'>;

export interface ICustomerFromResponse extends ICustomer {
  _id: string;
  createdOn: string;
}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersAllResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
}

export interface ICustomersFilteredResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  country: COUNTRIES[];
  sorting: {
    sortField: customersSortField;
    sortOrder: sortDirection;
  };
}

export interface ICustomerFilterParams {
  search?: string;
  country?: COUNTRIES[];
  sortField?: customersSortField;
  sortOrder?: sortDirection;
}
