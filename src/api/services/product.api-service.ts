import { ProductsController } from 'api/controllers/product.controller';
import { generateProductData } from 'data/products/generateProduct.data';
import { STATUS_CODES } from 'data/statusCodes';
import { IProductPayload, IProduct } from 'types/product.types';
import { logStep } from 'utils/reporter.utils';
import { validateResponse } from 'utils/validations/responseValidation';

export class ProductsApiService {
  private controller: ProductsController;

  constructor(controller: ProductsController) {
    this.controller = controller;
  }

  @logStep('Create Product via API')
  async create(token: string, productData?: Partial<IProductPayload>) {
    const body = generateProductData(productData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Product;
  }

  @logStep('Get Product by ID via API')
  async getById(token: string, productId: string) {
    const response = await this.controller.getById(productId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Product;
  }

  @logStep('Update Product via API')
  async updateProduct(id: string, updates: Partial<IProductPayload>, token: string) {
    const response = await this.controller.update(id, updates, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Product;
  }

  @logStep('Delete Product via API')
  async delete(productId: string, token: string) {
    const response = await this.controller.delete(productId, token);
    validateResponse(response, STATUS_CODES.DELETED);
  }

  @logStep('Get all products via API')
  async getAllProducts(token: string) {
    const response = await this.controller.getAll(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body;
  }

  @logStep('Populate products via API')
  async createMultiple(count: number = 3, token: string): Promise<IProduct[]> {
    return await Promise.all(Array.from({ length: count }, async () => this.create(token)));
  }
}
