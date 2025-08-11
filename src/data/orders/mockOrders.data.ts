import { COUNTRIES } from 'data/customers/countries.data';
import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { ICustomerFromResponse } from 'types/customer.types';
import { IManager, IDelivery, IHistory, ICommentFromResponse, IOrderFromResponse, IOrderFilteredResponse } from 'types/orders.types';
import { IProductFromResponse } from 'types/products.types';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { DELIVERY } from './delivery.data';
import { ORDER_HISTORY_ACTIONS } from './history.data';
import { ROLES } from './roles.data';
import { ORDER_STATUS } from './statuses.data';

// Моковые менеджеры (IManager)
export const MOCK_MANAGER_OLGA: IManager = {
  _id: '680d4d7dd006ba3d475ff67b',
  username: 'OlgaMarushkina',
  firstName: 'Olga',
  lastName: 'Marushkina',
  roles: [ROLES.USER],
  createdOn: '2025/04/26 21:17:49',
};

export const MOCK_MANAGER_NASTYA: IManager = {
  _id: '680f4ee2d006ba3d47600a5c',
  username: '2003@gmail.com',
  firstName: 'Anastasia',
  lastName: 'Super!',
  roles: [ROLES.USER],
  createdOn: '2025/04/28 09:48:18',
};

// Моковые клиенты (ICustomerFromResponse)
export const MOCK_CUSTOMER_ALICE: ICustomerFromResponse = {
  _id: generateUniqueId(),
  name: 'Alice Smith',
  email: 'alice.smith@example.com',
  country: COUNTRIES.USA,
  city: 'New York',
  street: 'Main St',
  house: 123,
  flat: 4,
  phone: '123-456-7890',
  notes: 'Regular customer.',
  role: 'User',
  createdOn: '2024-06-01T08:00:00Z',
};

export const MOCK_CUSTOMER_BOB: ICustomerFromResponse = {
  _id: generateUniqueId(),
  name: 'Bob Johnson',
  email: 'bob.johnson@example.com',
  country: COUNTRIES.CANADA,
  city: 'Toronto',
  street: 'Maple Ave',
  house: 45,
  flat: 10,
  phone: '098-765-4321',
  notes: 'VIP customer.',
  role: 'Admin',
  createdOn: '2024-06-10T09:30:00Z',
};

export const MOCK_CUSTOMER_CHARLIE: ICustomerFromResponse = {
  _id: generateUniqueId(),
  name: 'Charlie Brown',
  email: 'charlie.brown@example.com',
  country: COUNTRIES.USA,
  city: 'Los Angeles',
  street: 'Sunset Blvd',
  house: 789,
  flat: 12,
  phone: '111-222-3333',
  notes: 'New customer.',
  role: 'User',
  createdOn: '2024-06-15T11:45:00Z',
};

// Моковые продукты (IProductFromResponse)
export const MOCK_PRODUCT_TWO: IProductFromResponse = {
  _id: generateUniqueId(),
  name: 'New Product Two',
  price: 99.99,
  manufacturer: MANUFACTURERS.SAMSUNG,
  amount: 5,
  notes: 'Standard product notes.',
  createdOn: '2025-01-15T09:30:00Z',
};

export const MOCK_PRODUCT_ONE: IProductFromResponse = {
  _id: generateUniqueId(),
  name: 'New Product One',
  price: 49.99,
  manufacturer: MANUFACTURERS.APPLE,
  amount: 2,
  notes: 'Advanced product features.',
  createdOn: '2025-02-20T14:00:00Z',
};

export const MOCK_PRODUCT_THREE: IProductFromResponse = {
  _id: generateUniqueId(),
  name: 'New Product Three',
  price: 1234.0,
  manufacturer: MANUFACTURERS.APPLE,
  amount: 1,
  notes: 'Internal testing notes.',
  createdOn: '2025-05-20T01:20:00Z',
};

// Моковая доставка (IDelivery)
export const MOCK_DELIVERY_EXAMPLE: IDelivery = {
  finalDate: '2025-07-15T00:00:00Z',
  condition: DELIVERY.DELIVERY,
  address: {
    country: COUNTRIES.USA,
    city: 'New York',
    street: 'Main St',
    house: 123,
    flat: 4,
  },
};

// Моковая история (IHistory)
export const MOCK_HISTORY_CREATED_ALICE: IHistory = {
  action: ORDER_HISTORY_ACTIONS.CREATED,
  status: ORDER_STATUS.DRAFT,
  customer: MOCK_CUSTOMER_ALICE.name,
  products: [{ ...MOCK_PRODUCT_TWO, received: false }],
  total_price: MOCK_PRODUCT_TWO.price,
  delivery: null,
  changedOn: '2025-07-01T10:00:00Z',
  performer: MOCK_MANAGER_OLGA,
  assignedManager: null,
};

// Моковый комментарий (ICommentFromResponse)
export const MOCK_COMMENT_INITIAL: ICommentFromResponse = {
  _id: generateUniqueId(),
  text: 'Initial comment on order',
  createdOn: '2025-07-01T10:05:00Z',
};

// Моковые ордера (IOrderFromResponse)
export const MOCK_ORDER_IN_PROCESS: IOrderFromResponse = {
  _id: generateUniqueId(),
  status: ORDER_STATUS.IN_PROCESS,
  customer: MOCK_CUSTOMER_ALICE,
  products: [
    { ...MOCK_PRODUCT_TWO, received: false },
    { ...MOCK_PRODUCT_ONE, received: false },
  ],
  delivery: MOCK_DELIVERY_EXAMPLE,
  total_price: MOCK_PRODUCT_TWO.price + MOCK_PRODUCT_ONE.price,
  createdOn: '2025-07-01T09:00:00Z',
  history: [MOCK_HISTORY_CREATED_ALICE],
  comments: [MOCK_COMMENT_INITIAL],
  assignedManager: MOCK_MANAGER_OLGA,
};

export const MOCK_ORDER_DRAFT: IOrderFromResponse = {
  _id: generateUniqueId(),
  status: ORDER_STATUS.DRAFT,
  customer: MOCK_CUSTOMER_BOB,
  products: [{ ...MOCK_PRODUCT_TWO, received: false }],
  delivery: null,
  total_price: MOCK_PRODUCT_TWO.price,
  createdOn: '2025-07-02T10:00:00Z',
  history: [
    {
      ...MOCK_HISTORY_CREATED_ALICE,
      customer: MOCK_CUSTOMER_BOB.name,
      status: ORDER_STATUS.DRAFT,
      products: [{ ...MOCK_PRODUCT_TWO, received: false }],
    },
  ],
  comments: [],
  assignedManager: null,
};

export const MOCK_ORDER_CANCELED: IOrderFromResponse = {
  _id: generateUniqueId(),
  status: ORDER_STATUS.CANCELED,
  customer: MOCK_CUSTOMER_CHARLIE,
  products: [{ ...MOCK_PRODUCT_ONE, received: true }],
  delivery: MOCK_DELIVERY_EXAMPLE,
  total_price: MOCK_PRODUCT_ONE.price,
  createdOn: '2025-07-03T11:00:00Z',
  history: [
    {
      ...MOCK_HISTORY_CREATED_ALICE,
      customer: MOCK_CUSTOMER_CHARLIE.name,
      status: ORDER_STATUS.CANCELED,
      products: [{ ...MOCK_PRODUCT_ONE, received: true }],
    },
  ],
  comments: [
    {
      ...MOCK_COMMENT_INITIAL,
      _id: generateUniqueId(),
      text: 'Order canceled due to customer request',
    },
  ],
  assignedManager: null,
};

// API Response Mocks
export const MOCK_ORDERS_LIST_API_RESPONSE: IOrderFilteredResponse = {
  Orders: [MOCK_ORDER_IN_PROCESS, MOCK_ORDER_DRAFT, MOCK_ORDER_CANCELED],
  ErrorMessage: null,
  IsSuccess: true,
  total: 3,
  page: 1,
  limit: 10,
  search: '',
  status: [],
  sorting: {
    sortField: 'createdOn',
    sortOrder: 'desc',
  },
};
