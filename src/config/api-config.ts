export const apiConfig = {
  BASE_URL: 'https://aqa-course-project.app',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    ALL_CUSTOMERS: '/api/customers/all',
    CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}/`,
    // config/api-config.ts
    CUSTOMER_ORDERS: (id: string) => `/api/customers/${id}/orders`,
    PRODUCTS: '/api/products',
    ALL_PRODUCTS: '/api/products/all',
    PRODUCT_BY_ID: (id: string) => `/api/products/${id}/`,
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    ORDERS: '/api/orders',
    ORDER_BY_ID: (id: string) => `/api/orders/${id}/`,
    ORDER_RECEIVE: (id: string) => `/api/orders/${id}/receive`,
    ORDER_DELIVERY: (id: string) => `/api/orders/${id}/delivery`,
    ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,
    ORDER_COMMENT: (id: string) => `/api/orders/${id}/comments`,
    ORDER_DELETE: (id: string) => `/api/orders/${id}/`,
    ORDER_COMMENT_BY_ID: (orderId: string, commentId: string) =>
      `/api/orders/${orderId}/comments/${commentId}`,
    ASSIGN_MANAGER: (orderId: string, managerId: string) =>
      `/api/orders/${orderId}/assign-manager/${managerId}`,
    UNASSIGN_MANAGER: (orderId: string) =>
      `/api/orders/${orderId}/unassign-manager`,
  },
} as const;
