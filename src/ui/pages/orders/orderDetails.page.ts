import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { OrderDetailsPanelComponent } from './components/orderDetailsPanelComponent.page';
import { OrderDetailsReceivedProductsSection } from './components/orderDetailsReceivedProducts.page';
import { OrderCommentsTab } from './components/orderDetailsCommentsComponent.page';
import { EditOrderModal } from '../modals/orders/editProductsInOrderModal.page';
import { OrderCustomerDetailsComponentPage } from './components/orderCustomerDetailsComponent.page';
import { OrderDeliveryTab } from './components/orderDetailsDeliveryComponent.page';
import { SelectManagerModal } from '../modals/orders/selectManagerModal.page';
// import { apiConfig } from 'config/api-config';
import { logStep } from 'utils/reporter.utils';

export class OrderDetailsPage extends SalesPortalPage {
  topPanel = new OrderDetailsPanelComponent(this.page);
  receivedProductsSection = new OrderDetailsReceivedProductsSection(this.page);
  commentsSection = new OrderCommentsTab(this.page);
  editProductsInOrderModal = new EditOrderModal(this.page);
  customerDetailsSection = new OrderCustomerDetailsComponentPage(this.page);
  deliverySection = new OrderDeliveryTab(this.page);
  editAssignedManagerInOrderModal = new SelectManagerModal(this.page);

  uniqueElement = this.topPanel.title;

  @logStep('Open Order Details page by ID')
  async openById(id: string) {
    await this.page.goto(`/#/orders/${id}`);
  }
}
