import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { ProductsSortField, IResponseFields, SortDirection } from './api.types';

export interface IProductPayload {
  name: string;
  price: number;
  manufacturer: MANUFACTURERS;
  amount: number;
  notes?: string;
}

export interface IProduct extends IProductPayload {
  _id: string;
  createdOn: string;
}

export interface IProductResponse extends IResponseFields {
  Product: IProduct;
}

export interface IProductsListResponse extends IResponseFields {
  Products: IProduct[];
}

export interface IProductsSearchResponse extends IResponseFields {
  Products: IProduct[];
  total: number;
  page: number;
  limit: number;
  search: string;
  manufacturer: MANUFACTURERS[];
  sorting: {
    sortField: ProductsSortField;
    sortOrder: SortDirection;
  };
}

export interface IProductSearchParams {
  search?: string;
  manufacturer?: MANUFACTURERS[];
  sortField?: ProductsSortField;
  sortOrder?: SortDirection;
}

export interface IProductFactory {
  singleProduct: (customData?: Partial<IProductPayload>) => Promise<IProduct>;
  multipleProducts: (productCount?: number, customData?: Partial<IProductPayload>) => Promise<IProduct[]>;
  multipleProductsIds: (productCount?: number, customData?: Partial<IProductPayload>) => Promise<string[]>;
}

export interface ICustomProduct {
  productFactory: IProductFactory;
}
