import { SalesPortalPage } from '../../salesPortal.page';
import { logStep } from '../../../../utils/reporter.utils';

export class OrderCustomerDetailsComponentPage extends SalesPortalPage {
  readonly uniqueElement = this.page.locator('#customer-section');

  readonly title = this.uniqueElement.getByRole('heading', {
    name: 'Customer Details',
  });
  readonly editCustomerButton = this.uniqueElement.locator('#edit-customer-pencil');

  readonly valueByField = (name: string) => this.uniqueElement.locator(`.c-details:has(span:has-text("${name}")) > span.s-span:last-of-type`);

  readonly customerEmail = this.valueByField('Email');
  readonly customerName = this.valueByField('Name');
  readonly customerCountry = this.valueByField('Country');
  readonly customerCity = this.valueByField('City');
  readonly customerStreet = this.valueByField('Street');
  readonly customerHouse = this.valueByField('House');
  readonly customerFlat = this.valueByField('Flat');
  readonly customerPhone = this.valueByField('Phone');
  readonly customerCreatedOn = this.valueByField('Created On');
  readonly customerNotes = this.valueByField('Notes');

  @logStep('Get Customer Details Title')
  async getCustomerDetailsTitle() {
    return await this.title.textContent();
  }

  @logStep('Click On "Edit Customer" button')
  async clickEditCustomerButton() {
    await this.editCustomerButton.click();
  }

  @logStep('Get Customer Email')
  async getCustomerEmail() {
    return await this.customerEmail.textContent();
  }

  @logStep('Get Customer Name')
  async getCustomerName() {
    return await this.customerName.textContent();
  }

  @logStep('Get Customer Country')
  async getCustomerCountry() {
    return await this.customerCountry.textContent();
  }

  @logStep('Get Customer City')
  async getCustomerCity() {
    return await this.customerCity.textContent();
  }

  @logStep('Get Customer Street')
  async getCustomerStreet() {
    return await this.customerStreet.textContent();
  }

  @logStep('Get Customer House')
  async getCustomerHouse() {
    return await this.customerHouse.textContent();
  }

  @logStep('Get Customer Flat')
  async getCustomerFlat() {
    return await this.customerFlat.textContent();
  }

  @logStep('Get Customer Phone')
  async getCustomerPhone() {
    return await this.customerPhone.textContent();
  }

  @logStep('Get Customer Created On')
  async getCustomerCreatedOn() {
    return await this.customerCreatedOn.textContent();
  }

  @logStep('Get Customer Notes')
  async getCustomerNotes() {
    return await this.customerNotes.textContent();
  }

  @logStep('Get All Info Of Customer Details')
  async getAllCustomerDetails() {
    const [Email, Name, Country, City, Street, House, Flat, Phone, CreatedOn, Notes] = await Promise.all([
      this.getCustomerEmail(),
      this.getCustomerName(),
      this.getCustomerCountry(),
      this.getCustomerCity(),
      this.getCustomerStreet(),
      this.getCustomerHouse(),
      this.getCustomerFlat(),
      this.getCustomerPhone(),
      this.getCustomerCreatedOn(),
      this.getCustomerNotes(),
    ]);
    return {
      Email,
      Name,
      Country,
      City,
      Street,
      House,
      Flat,
      Phone,
      CreatedOn,
      Notes,
    };
  }
}
