import { COUNTRIES } from 'data/customers/countries.data';
import { CustomersSortField, IResponseFields, SortDirection } from './api.types';

export interface ICustomerPayload {
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

export type CustomerInTable = Pick<ICustomerPayload, 'email' | 'country' | 'name'>;

export interface ICustomerEntity extends ICustomerPayload {
  _id: string;
  createdOn: string;
}

export interface ISingleCustomerResponse extends IResponseFields {
  Customer: ICustomerEntity;
}

export interface ICustomerListResponse extends IResponseFields {
  Customers: ICustomerEntity[];
}

export interface IFilteredCustomersResponse extends IResponseFields {
  Customers: ICustomerEntity[];
  total: number;
  page: number;
  limit: number;
  search: string;
  country: COUNTRIES[];
  sorting: {
    sortField: CustomersSortField;
    sortOrder: SortDirection;
  };
}

export interface ICustomerFilterParams {
  search?: string;
  country?: COUNTRIES[];
  sortField?: CustomersSortField;
  sortOrder?: SortDirection;
}

export interface ICustomerFactory {
  singleCustomer: (customData?: Partial<ICustomerEntity>) => Promise<ICustomerEntity>;
  multipleCustomers: (count?: number, customData?: Partial<ICustomerEntity>) => Promise<ICustomerEntity[]>;
}

export interface ICustomCustomer {
  customerFactory: ICustomerFactory;
}
