import { test, expect } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { TAGS } from 'data/testTags.data';
import { COUNTRIES } from 'data/customers/countries.data';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { ICustomerFilterParams } from 'types/customer.types';
import { validateSchema } from 'utils/validations/schemaValidation';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { customersListSchema } from 'data/schemas/customer.schema';

test.describe('[API] [Customers] GET customers - filters and sorting - 200 OK', () => {
  const expectedIds: string[] = [];
  const totalCustomers = 1;

  test.describe('Positive', () => {
    test(
      'Should return list of customers after searching by name with space - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedName = `SearchTest${Math.random()
          .toString(25)
          .replace(/[^a-z]/g, '')}`;
        const expectedCustomer = await customerFactory.multipleCustomers(totalCustomers, { name: expectedName });

        const params: ICustomerFilterParams = {
          search: expectedName,
          sortField: 'createdOn',
          sortOrder: 'desc',
        };

        const response = await customersController.getFilteredCustomers(workerToken, params);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.search, `The parameter 'search' should be '${expectedName}', but it was '${response.body.search}'`).toBe(expectedName);
        expect(response.body.Customers.every((c) => c.name.toLowerCase().includes(expectedName.toLowerCase()))).toBeTruthy();

        expect(response.body.Customers).toMatchObject(expectedCustomer);
      },
    );

    test(
      'Should return list of customers after filtering by single country - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData({ country: COUNTRIES.BELARUS });
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const params: ICustomerFilterParams = {
          country: [expectedCustomerData.country],
          sortField: 'createdOn',
          sortOrder: 'desc',
        };

        const response = await customersController.getFilteredCustomers(workerToken, params);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBeGreaterThan(totalCustomers);
        expect(response.body.country).toEqual([expectedCustomerData.country]);
        expect(response.body.Customers.every((c) => c.country === expectedCustomerData.country)).toBeTruthy();
      },
    );

    test(
      'Should return list of customers after filtering by multiple countries - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const countries = [COUNTRIES.FRANCE, COUNTRIES.RUSSIA];
        await Promise.all(
          countries.map(async (country) => {
            const expectedCustomerData = generateCustomerData({ country });
            const response = await customerFactory.singleCustomer(expectedCustomerData);
            expectedIds.push(response._id);
          }),
        );

        const params: ICustomerFilterParams = {
          country: countries,
          sortField: 'createdOn',
          sortOrder: 'desc',
        };

        const response = await customersController.getFilteredCustomers(workerToken, params);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.country).toEqual(expect.arrayContaining(countries));
        expect(response.body.Customers.every((c) => countries.includes(c.country as COUNTRIES))).toBeTruthy();
      },
    );

    test('Should return list of customers after sorting by createdOn ascending - 200 OK', async ({
      workerToken,
      customersController,
      customerFactory,
    }) => {
      const users = await customerFactory.multipleCustomers(totalCustomers);
      expectedIds.push(...users.map((u) => u._id));

      const response = await customersController.getFilteredCustomers(workerToken, {
        sortField: 'createdOn',
        sortOrder: 'asc',
      });
      validateResponse(response, STATUS_CODES.OK, true, null);

      const dates = response.body.Customers.map((c) => new Date(c.createdOn).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i + 1]);
      }
    });

    test(
      'Should return list of customers after sorting by createdOn descending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION],
      },
      async ({ workerToken, customerFactory, customersController }) => {
        const users = await customerFactory.multipleCustomers(totalCustomers);
        expectedIds.push(...users.map((u) => u._id));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'createdOn',
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);

        const dates = response.body.Customers.map((c) => new Date(c.createdOn).getTime());
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }

        expect(response.body.sorting.sortField).toBe('createdOn');
        expect(response.body.sorting.sortOrder).toBe('desc');
      },
    );

    test(
      'Should return list of customers after sorting by name descending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customerFactory, customersController }) => {
        const totalCustomers = 1;
        const users = await customerFactory.multipleCustomers(totalCustomers);
        expectedIds.push(...users.map((u) => u._id));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'name',
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);

        const names = response.body.Customers.map((c) => c.name.toLowerCase());
        for (let i = 0; i < names.length - 1; i++) {
          expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);
        }

        expect(response.body.sorting.sortField).toBe('name');
        expect(response.body.sorting.sortOrder).toBe('desc');
      },
    );

    test(
      'Should return list of customers after sorting by name ascending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customerFactory, customersController }) => {
        const totalCustomers = 1;
        const users = await customerFactory.multipleCustomers(totalCustomers);
        expectedIds.push(...users.map((u) => u._id));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'name',
          sortOrder: 'asc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        const names = response.body.Customers.map((c) => c.name.toLowerCase());
        for (let i = 0; i < names.length - 1; i++) {
          expect(names[i].localeCompare(names[i + 1])).toBeLessThanOrEqual(0);
        }

        expect(response.body.sorting.sortField).toBe('name');
        expect(response.body.sorting.sortOrder).toBe('asc');
      },
    );

    test(
      'Should return list of customers after searching by email with country filter - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const testCountry = COUNTRIES.BELARUS;
        const expectedCustomerData = generateCustomerData({ country: testCountry });
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const params: ICustomerFilterParams = {
          search: expectedCustomerData.email,
          country: [testCountry],
          sortField: 'createdOn',
          sortOrder: 'desc',
        };

        const response = await customersController.getFilteredCustomers(workerToken, params);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.search).toBe(expectedCustomerData.email);
        expect(response.body.country).toEqual([testCountry]);
        expect(response.body.Customers.some((c) => c._id === expectedCustomer._id)).toBeTruthy();
      },
    );

    test(
      'Should return list of customers after sorting by email ascending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customerFactory, customersController }) => {
        const totalCustomers = 1;
        const users = await customerFactory.multipleCustomers(totalCustomers);
        expectedIds.push(...users.map((u) => u._id));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'email',
          sortOrder: 'asc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.sorting.sortField).toBe('email');
        expect(response.body.sorting.sortOrder).toBe('asc');

        const emails = response.body.Customers.map((c) => c.email?.toLowerCase()).filter(Boolean);
        for (let i = 0; i < emails.length - 1; i++) {
          expect(emails[i]!.localeCompare(emails[i + 1]!)).toBeLessThanOrEqual(0);
        }
      },
    );

    test(
      'Should return list of customers after sorting by email descending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customerFactory, customersController }) => {
        const totalCustomers = 1;
        const users = await customerFactory.multipleCustomers(totalCustomers);
        expectedIds.push(...users.map((u) => u._id));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'email',
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.sorting.sortField).toBe('email');
        expect(response.body.sorting.sortOrder).toBe('desc');

        const emails = response.body.Customers.map((c) => c.email?.toLowerCase()).filter(Boolean) as string[];
        for (let i = 0; i < emails.length - 1; i++) {
          expect(emails[i].localeCompare(emails[i + 1])).toBeGreaterThanOrEqual(0);
        }
      },
    );

    test(
      'Should return list of customers after sorting by country descending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const testCountries = [COUNTRIES.BELARUS, COUNTRIES.USA, COUNTRIES.GERMANY];
        await Promise.all(testCountries.map((country) => customerFactory.singleCustomer({ ...generateCustomerData(), country })));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'country',
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.sorting.sortField).toBe('country');
        expect(response.body.sorting.sortOrder).toBe('desc');

        const countries = response.body.Customers.map((c) => c.country);
        const expectedSorted = [...countries].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
        expect(countries).toEqual(expectedSorted);
      },
    );

    test(
      'Should return list of customers after sorting by country ascending - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const testCountries = [COUNTRIES.BELARUS, COUNTRIES.USA, COUNTRIES.GERMANY];
        await Promise.all(testCountries.map((country) => customerFactory.singleCustomer({ ...generateCustomerData(), country })));

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'country',
          sortOrder: 'asc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.sorting.sortField).toBe('country');
        expect(response.body.sorting.sortOrder).toBe('asc');

        const countries = response.body.Customers.map((c) => c.country);
        const expectedSorted = [...countries].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        expect(countries).toEqual(expectedSorted);
      },
    );

    test(
      'Should return list of customers on second page - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customerFactory, customersController }) => {
        const users = await customerFactory.multipleCustomers(15);
        expectedIds.push(...users.map((u) => u._id));

        const [firstPage, secondPage] = await Promise.all([
          customersController.getCustomersWithPagination(workerToken, {
            page: 1,
            limit: 10,
          }),
          customersController.getCustomersWithPagination(workerToken, {
            page: 2,
            limit: 10,
          }),
        ]);

        validateResponse(secondPage, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, secondPage.body);

        expect(secondPage.body.page).toBe(2);
        expect(secondPage.body.limit).toBe(10);
        expect(secondPage.body.total).toBeGreaterThanOrEqual(15);

        const firstPageIds = firstPage.body.Customers.map((c) => c._id);
        const secondPageIds = secondPage.body.Customers.map((c) => c._id);
        expect(firstPageIds.some((id) => secondPageIds.includes(id))).toBe(false);
      },
    );

    test(
      'Should return list of customers after searching by name without spaces',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const testName = 'BrycenQuigley';
        const expectedCustomerData = { ...generateCustomerData(), name: testName };

        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const params: ICustomerFilterParams = {
          search: testName,
          sortField: 'createdOn',
          sortOrder: 'desc',
        };

        const response = await customersController.getFilteredCustomers(workerToken, params);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.search).toBe(testName);
        expect(response.body.Customers.every((c) => c.name.includes(testName))).toBeTruthy();
      },
    );

    test(
      'Should return list of customers after searching by country name',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const testCountry = expectedCustomerData.country;

        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const params: ICustomerFilterParams = {
          search: testCountry,
          sortField: 'createdOn',
          sortOrder: 'desc',
        };

        const response = await customersController.getFilteredCustomers(workerToken, params);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.search).toBe(testCountry);
        expect(response.body.Customers.every((c) => c.country === testCountry)).toBe(true);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      'Empty search parameter',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getFilteredCustomers(workerToken, {
          search: '',
          sortField: 'createdOn',
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.search).toBe('');
        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.Customers.length).toBeLessThanOrEqual(10);
      },
    );

    test(
      'Pagination with page only',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getCustomersWithPagination(workerToken, {
          page: 1,
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.total).toBeGreaterThan(0);
        expect(response.body.limit).toBe(10);
        expect(response.body.page).toBe(1);
        expect(response.body.Customers.length).toBeLessThanOrEqual(10);
      },
    );

    test(
      'Pagination with limit only',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getCustomersWithPagination(workerToken, {
          limit: 10,
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.total).toBeGreaterThan(0);
        expect(response.body.limit).toBe(10);
        expect(response.body.page).toBe(1);
        expect(response.body.Customers.length).toBeLessThanOrEqual(10);
      },
    );

    test(
      'First non-existent page - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const allCustomersResponse = await customersController.getAllCustomers(workerToken);
        const totalCustomers = allCustomersResponse.body.Customers.length;
        const limit = 10;
        const firstNonexistentPage = Math.ceil(totalCustomers / limit) + 1;

        const response = await customersController.getCustomersWithPagination(workerToken, {
          page: firstNonexistentPage,
          limit: limit,
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBe(0);
        expect(response.body.page).toBe(firstNonexistentPage);
        expect(response.body.limit).toBe(limit);
      },
    );

    test(
      'Non-existent country filter - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getFilteredCustomers(workerToken, {
          country: ['Brazil'] as unknown as COUNTRIES[],
          sortField: 'createdOn',
          sortOrder: 'asc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);
        expect(response.body.Customers.length).toBe(0);
      },
    );

    test(
      'Empty country filter - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getFilteredCustomers(workerToken, {
          country: [],
          sortField: 'createdOn',
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);
        expect(response.body.Customers.length).toBeGreaterThan(0);
      },
    );

    test(
      'Sort field without sort order - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortField: 'createdOn',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);
        expect(response.body.Customers.length).toBeGreaterThan(0);
      },
    );

    test(
      'Sort order without sort field - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getFilteredCustomers(workerToken, {
          sortOrder: 'desc',
        });

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);
        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.sorting?.sortOrder).toBe('desc');
      },
    );

    test(
      'Invalid auth token - 401 Unauthorized',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ customersController }) => {
        const response = await customersController.getAllCustomers('invalid_token');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    test(
      'Missing auth token - 401 Unauthorized',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION],
      },
      async ({ customersController }) => {
        const response = await customersController.getAllCustomers('');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'No parameters - 200 OK',
      {
        tag: [TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ workerToken, customersController, customerFactory }) => {
        const expectedCustomerData = generateCustomerData();
        const expectedCustomer = await customerFactory.singleCustomer(expectedCustomerData);
        expectedIds.push(expectedCustomer._id);

        const response = await customersController.getFilteredCustomers(workerToken, {});

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(customersListSchema, response.body);

        expect(response.body.Customers.length).toBeGreaterThan(0);
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(10);
      },
    );
  });
});
