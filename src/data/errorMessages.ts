export const ERROR_MESSAGES = {
  INCORRECT_REQUEST_BODY: 'Incorrect request body',
  NOT_AUTHORIZED: 'Not authorized',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  CUSTOMER_NOT_FOUND: (id: string) => `Customer with id '${id}' wasn't found`,
  CUSTOMER_ID_FOR_ORDERS_NOT_FOUND: (id: string) => `Not found customer with ID: ${id}`,
  INVALID_ORDER_STATUS: 'Invalid order status',
  //TODO: После исправления бага с id, убрать ошибку ORDER_NOT_FOUND_WITH_ID, оставить только ORDER_NOT_FOUND с передаваемым id
  ORDER_NOT_FOUND: `Order with id 'undefined' wasn't found`,
  PRODUCT_IS_NOT_REQUESTED_IN_ORDER: (id: string) => `Product with Id '${id}' is not requested`,
  CANT_REOPEN_ORDER: `Can't reopen not canceled order`,
  ORDER_NOT_FOUND_WITH_ID: (id: string) => `Order with id '${id}' wasn't found`,
  MANAGER_NOT_FOUND: (id: string) => `Manager with id '${id}' wasn't found`,
  COMMENT_NOT_FOUND: `Comment was not found`,
  MISSING_CUSTOMER: 'Missing customer',
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
};
