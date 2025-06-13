import { APIRequestContext } from '@playwright/test'
import { ProductsController } from 'api/controllers/products.controller'
import { generateProductData } from 'data/products/generateProduct'
import { STATUS_CODES } from 'data/statusCodes'
import {
  IProduct,
  IProductFromResponse,
  IProductsAllResponse,
} from 'types/products.types'
import { logStep } from 'utils/reporter.utils'
import { validateResponse } from 'utils/validations/responseValidation'

export class ProductsApiService {
  controller: ProductsController
  constructor(request: APIRequestContext) {
    this.controller = new ProductsController(request)
  }

  @logStep('Create Product via API')
  async create(token: string, productData?: IProduct) {
    const body = generateProductData(productData)
    const response = await this.controller.create(body, token)
    validateResponse(response, STATUS_CODES.CREATED, true, null)
    return response.body.Product as IProductFromResponse
  }

  @logStep('Get Product by ID via API')
  async getById(token: string, productId: string) {
    const response = await this.controller.getById(productId, token)
    validateResponse(response, STATUS_CODES.OK, true, null)
    return response.body.Product as IProductFromResponse
  }

  @logStep('Update Product via API')
  async updateProduct(id: string, updates: Partial<IProduct>, token: string) {
    const response = await this.controller.update(id, updates, token)
    validateResponse(response, STATUS_CODES.OK, true, null)
    return response.body.Product
  }

  @logStep('Delete Product via API')
  async delete(token: string, productId: string) {
    const response = await this.controller.delete(productId, token)
    validateResponse(response, STATUS_CODES.DELETED, null, null)
  }
  @logStep('Get all products via API')
  async getAllProducts(token: string) {
    const response = await this.controller.getAll(token)
    validateResponse(response, STATUS_CODES.OK, true, null)
    return response.body as IProductsAllResponse
  }
}
