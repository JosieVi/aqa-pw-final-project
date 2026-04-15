/**
 * Centralized constants for UI element texts used in locators.
 * This reduces hardcoded strings throughout the test code and makes maintenance easier.
 */

export const BUTTON_NAMES = {
  LOGIN: 'Login',
  CREATE_ORDER: 'Create Order',
  CLOSE: 'Close',
  CANCEL: 'Cancel',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
} as const;

export const PAGE_TITLES = {
  WELCOME: 'Welcome to Sales Management Portal',
  ORDERS_LIST: 'Orders List ',
  REQUESTED_PRODUCTS: 'Requested Products',
} as const;

export const LINK_NAMES = {
  VIEW_CUSTOMERS: 'View Customers',
  VIEW_PRODUCTS: 'View Products',
  VIEW_ORDERS: 'View Orders',
} as const;

export const TABLE_HEADERS = {
  ORDER_NUMBER: 'Order Number',
  EMAIL: 'Email',
  PRICE: 'Price',
  DELIVERY: 'Delivery',
  STATUS: 'Status',
  ASSIGNED_MANAGER: 'Assigned Manager',
  CREATED_ON: 'Created On',
  ACTIONS: 'Actions',
} as const;

export const FORM_LABELS = {
  ITEMS_ON_PAGE: 'Items on page:',
} as const;

export type ButtonName = (typeof BUTTON_NAMES)[keyof typeof BUTTON_NAMES];
export type PageTitle = (typeof PAGE_TITLES)[keyof typeof PAGE_TITLES];
export type LinkName = (typeof LINK_NAMES)[keyof typeof LINK_NAMES];
export type TableHeader = (typeof TABLE_HEADERS)[keyof typeof TABLE_HEADERS];
export type FormLabel = (typeof FORM_LABELS)[keyof typeof FORM_LABELS];
