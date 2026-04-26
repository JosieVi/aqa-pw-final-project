# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src/ui/tests/orders/criticalPath/editCustomer.spec.ts >> [UI] [Orders] [Customer] >> [UI] [Orders] [Customer] [Positive] Edit customer >> [UI] [Orders] [Customer] [Negative] Orders were created dynamically by service >> Should not open edit customer modal for In Process order
- Location: src/ui/tests/orders/criticalPath/editCustomer.spec.ts:224:11

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('#table-orders').locator('tbody').locator('tr').filter({ hasText: '69ee7ed38b131b5ff4bf9b40' }).getByTitle('Details', { exact: true })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img
        - generic [ref=e7]: Sales Portal
      - link "Home" [ref=e9] [cursor=pointer]:
        - /url: "#/home"
      - link "Orders" [ref=e11] [cursor=pointer]:
        - /url: "#/orders"
      - link "Products" [ref=e13] [cursor=pointer]:
        - /url: "#/products"
      - link "Customers" [ref=e15] [cursor=pointer]:
        - /url: "#/customers"
      - link "Managers" [ref=e17] [cursor=pointer]:
        - /url: "#/managers"
    - generic [ref=e19]:
      - button " 1" [ref=e21] [cursor=pointer]:
        - generic: 
        - generic [ref=e22]: "1"
      - button "" [ref=e23] [cursor=pointer]:
        - generic: 
      - link "User" [ref=e25] [cursor=pointer]:
        - /url: "#/managers/undefined"
        - strong [ref=e26]: User
      - button "" [ref=e27] [cursor=pointer]:
        - generic: 
  - generic [ref=e28]:
    - generic [ref=e30]:
      - generic [ref=e31]:
        - heading "Orders List" [level=2] [ref=e32]
        - button "Create Order" [ref=e33] [cursor=pointer]
      - generic [ref=e34]:
        - generic [ref=e35]:
          - searchbox "Search" [ref=e36]
          - button " Search" [disabled]:
            - generic: 
            - text: Search
        - button " Filter" [ref=e37] [cursor=pointer]:
          - generic: 
          - text: Filter
        - button "Export" [ref=e38] [cursor=pointer]
    - generic [ref=e41]:
      - table [ref=e43]:
        - rowgroup [ref=e44]:
          - row "Order Number Email Price Delivery Status Assigned Manager Created On  Actions" [ref=e45]:
            - columnheader "Order Number" [ref=e46]:
              - generic [ref=e48] [cursor=pointer]: Order Number
            - columnheader "Email" [ref=e49]:
              - generic [ref=e51] [cursor=pointer]: Email
            - columnheader "Price" [ref=e52]:
              - generic [ref=e54] [cursor=pointer]: Price
            - columnheader "Delivery" [ref=e55]:
              - generic [ref=e57] [cursor=pointer]: Delivery
            - columnheader "Status" [ref=e58]:
              - generic [ref=e60] [cursor=pointer]: Status
            - columnheader "Assigned Manager" [ref=e61]:
              - generic [ref=e63] [cursor=pointer]: Assigned Manager
            - columnheader "Created On " [ref=e64]:
              - generic [ref=e65]:
                - generic [ref=e66] [cursor=pointer]: Created On
                - generic [ref=e67]:
                  - generic: 
            - columnheader "Actions" [ref=e68]
        - rowgroup [ref=e69]:
          - row "69ee7ed38b131b5ff4bf9a64 test1777237715231_YHKV@example.com $47642 - Draft - 2026/04/26 21:08:35 " [ref=e70]:
            - cell "69ee7ed38b131b5ff4bf9a64" [ref=e71]
            - cell "test1777237715231_YHKV@example.com" [ref=e72]
            - cell "$47642" [ref=e73]
            - cell "-" [ref=e74]
            - cell "Draft" [ref=e75]
            - cell "-" [ref=e76]
            - cell "2026/04/26 21:08:35" [ref=e77]
            - cell "" [ref=e78]:
              - link "" [ref=e79] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9a64"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9a66 test1777237715231_ZQMT@example.com $94373 - Draft - 2026/04/26 21:08:35 " [ref=e80]:
            - cell "69ee7ed38b131b5ff4bf9a66" [ref=e81]
            - cell "test1777237715231_ZQMT@example.com" [ref=e82]
            - cell "$94373" [ref=e83]
            - cell "-" [ref=e84]
            - cell "Draft" [ref=e85]
            - cell "-" [ref=e86]
            - cell "2026/04/26 21:08:35" [ref=e87]
            - cell "" [ref=e88]:
              - link "" [ref=e89] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9a66"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9a84 test1777237715231_FZEX@example.com $1877 - Draft - 2026/04/26 21:08:35 " [ref=e90]:
            - cell "69ee7ed38b131b5ff4bf9a84" [ref=e91]
            - cell "test1777237715231_FZEX@example.com" [ref=e92]
            - cell "$1877" [ref=e93]
            - cell "-" [ref=e94]
            - cell "Draft" [ref=e95]
            - cell "-" [ref=e96]
            - cell "2026/04/26 21:08:35" [ref=e97]
            - cell "" [ref=e98]:
              - link "" [ref=e99] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9a84"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9a8c test1777237715233_MTMK@example.com $30983 - Draft - 2026/04/26 21:08:35 " [ref=e100]:
            - cell "69ee7ed38b131b5ff4bf9a8c" [ref=e101]
            - cell "test1777237715233_MTMK@example.com" [ref=e102]
            - cell "$30983" [ref=e103]
            - cell "-" [ref=e104]
            - cell "Draft" [ref=e105]
            - cell "-" [ref=e106]
            - cell "2026/04/26 21:08:35" [ref=e107]
            - cell "" [ref=e108]:
              - link "" [ref=e109] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9a8c"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9a9a test1777237715236_QPDU@example.com $70251 - Draft - 2026/04/26 21:08:35 " [ref=e110]:
            - cell "69ee7ed38b131b5ff4bf9a9a" [ref=e111]
            - cell "test1777237715236_QPDU@example.com" [ref=e112]
            - cell "$70251" [ref=e113]
            - cell "-" [ref=e114]
            - cell "Draft" [ref=e115]
            - cell "-" [ref=e116]
            - cell "2026/04/26 21:08:35" [ref=e117]
            - cell "" [ref=e118]:
              - link "" [ref=e119] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9a9a"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9aa9 test1777237715233_OEWG@example.com $54823 - Draft - 2026/04/26 21:08:35 " [ref=e120]:
            - cell "69ee7ed38b131b5ff4bf9aa9" [ref=e121]
            - cell "test1777237715233_OEWG@example.com" [ref=e122]
            - cell "$54823" [ref=e123]
            - cell "-" [ref=e124]
            - cell "Draft" [ref=e125]
            - cell "-" [ref=e126]
            - cell "2026/04/26 21:08:35" [ref=e127]
            - cell "" [ref=e128]:
              - link "" [ref=e129] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9aa9"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9ab0 test1777237715234_QQEU@example.com $51382 - Draft - 2026/04/26 21:08:35 " [ref=e130]:
            - cell "69ee7ed38b131b5ff4bf9ab0" [ref=e131]
            - cell "test1777237715234_QQEU@example.com" [ref=e132]
            - cell "$51382" [ref=e133]
            - cell "-" [ref=e134]
            - cell "Draft" [ref=e135]
            - cell "-" [ref=e136]
            - cell "2026/04/26 21:08:35" [ref=e137]
            - cell "" [ref=e138]:
              - link "" [ref=e139] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9ab0"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9ab2 test1777237715235_MDIO@example.com $64732 - Draft - 2026/04/26 21:08:35 " [ref=e140]:
            - cell "69ee7ed38b131b5ff4bf9ab2" [ref=e141]
            - cell "test1777237715235_MDIO@example.com" [ref=e142]
            - cell "$64732" [ref=e143]
            - cell "-" [ref=e144]
            - cell "Draft" [ref=e145]
            - cell "-" [ref=e146]
            - cell "2026/04/26 21:08:35" [ref=e147]
            - cell "" [ref=e148]:
              - link "" [ref=e149] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9ab2"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9ab4 test1777237715235_CWCA@example.com $29102 - Draft - 2026/04/26 21:08:35 " [ref=e150]:
            - cell "69ee7ed38b131b5ff4bf9ab4" [ref=e151]
            - cell "test1777237715235_CWCA@example.com" [ref=e152]
            - cell "$29102" [ref=e153]
            - cell "-" [ref=e154]
            - cell "Draft" [ref=e155]
            - cell "-" [ref=e156]
            - cell "2026/04/26 21:08:35" [ref=e157]
            - cell "" [ref=e158]:
              - link "" [ref=e159] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9ab4"
                - generic: 
          - row "69ee7ed38b131b5ff4bf9aba test1777237715236_AFKU@example.com $43830 - Draft - 2026/04/26 21:08:35 " [ref=e160]:
            - cell "69ee7ed38b131b5ff4bf9aba" [ref=e161]
            - cell "test1777237715236_AFKU@example.com" [ref=e162]
            - cell "$43830" [ref=e163]
            - cell "-" [ref=e164]
            - cell "Draft" [ref=e165]
            - cell "-" [ref=e166]
            - cell "2026/04/26 21:08:35" [ref=e167]
            - cell "" [ref=e168]:
              - link "" [ref=e169] [cursor=pointer]:
                - /url: "#/orders/69ee7ed38b131b5ff4bf9aba"
                - generic: 
      - generic [ref=e170]:
        - generic [ref=e171]:
          - generic [ref=e172]: "Items on page:"
          - combobox [ref=e173]:
            - option "10" [selected]
            - option "25"
            - option "50"
            - option "100"
        - generic [ref=e174]:
          - button "" [disabled]:
            - generic: 
          - button "1" [ref=e175] [cursor=pointer]
          - button "2" [ref=e176] [cursor=pointer]
          - button "3" [ref=e177] [cursor=pointer]
          - button "" [ref=e178] [cursor=pointer]:
            - generic: 
```

# Test source

```ts
  21  |   getChipByText(chipText: string) {
  22  |     return this.chipButtonsContainer.locator(`.chip:has-text("${chipText}")`);
  23  |   }
  24  |   getChipCloseButtonByText(chipText: string) {
  25  |     return this.getChipByText(chipText).locator('.close');
  26  |   }
  27  |   getChipButtonByIndex(index: number) {
  28  |     return this.allChips.nth(index);
  29  |   }
  30  | 
  31  |   readonly tableContainer = this.page.locator('#table-orders');
  32  |   readonly tableHeader = this.tableContainer.locator('thead');
  33  |   readonly tableBody = this.tableContainer.locator('tbody');
  34  | 
  35  |   readonly orderNumberHeader = this.tableHeader.getByText(TABLE_HEADERS.ORDER_NUMBER, {
  36  |     exact: true,
  37  |   });
  38  |   readonly emailHeader = this.tableHeader.getByText(TABLE_HEADERS.EMAIL, { exact: true });
  39  |   readonly priceHeader = this.tableHeader.getByText(TABLE_HEADERS.PRICE, { exact: true });
  40  |   readonly deliveryHeader = this.tableHeader.getByText(TABLE_HEADERS.DELIVERY, {
  41  |     exact: true,
  42  |   });
  43  |   readonly statusHeader = this.tableHeader.getByText(TABLE_HEADERS.STATUS, { exact: true });
  44  |   readonly assignedManagerHeader = this.tableHeader.getByText(TABLE_HEADERS.ASSIGNED_MANAGER, { exact: true });
  45  |   readonly createdOnHeader = this.tableHeader.getByText(TABLE_HEADERS.CREATED_ON, {
  46  |     exact: true,
  47  |   });
  48  |   readonly actionsHeader = this.tableHeader.getByText(TABLE_HEADERS.ACTIONS, {
  49  |     exact: true,
  50  |   });
  51  |   readonly allTableRows = this.tableBody.locator('tr');
  52  |   tableRowByOrderNumber(orderNumber: string) {
  53  |     return this.tableBody.locator('tr', { hasText: orderNumber });
  54  |   }
  55  |   private getSortableColumnHeaderLocator(columnName: OrdersListColumnForSorting) {
  56  |     return this.tableHeader.locator('th div[onclick*="sortOrdersInTable"]', {
  57  |       hasText: columnName,
  58  |     });
  59  |   }
  60  | 
  61  |   readonly paginationControlsContainer = this.page.locator('#pagination-controls');
  62  |   readonly itemsOnPageLabel = this.paginationControlsContainer.getByText(FORM_LABELS.ITEMS_ON_PAGE, {
  63  |     exact: true,
  64  |   });
  65  |   readonly paginationSelect = this.page.locator('#pagination-select');
  66  |   readonly paginationButtonsContainer = this.page.locator('#pagination-buttons');
  67  |   readonly previousPageButton = this.paginationButtonsContainer.locator(`button[title="${BUTTON_NAMES.PREVIOUS}"]`);
  68  |   readonly nextPageButton = this.paginationButtonsContainer.locator(`button[title="${BUTTON_NAMES.NEXT}"]`);
  69  |   getPageByNumber(pageNumber: number) {
  70  |     return this.paginationButtonsContainer.getByRole('button', {
  71  |       name: String(pageNumber),
  72  |       exact: true,
  73  |     });
  74  |   }
  75  |   detailsButtonByOrderNumber(orderNumber: string) {
  76  |     return this.tableRowByOrderNumber(orderNumber).locator('a.btn-link.table-btn:has(i.bi-card-text)');
  77  |   }
  78  |   reopenButtonByOrderNumber(orderNumber: string) {
  79  |     return this.tableRowByOrderNumber(orderNumber).locator('button.btn-link.table-btn i.bi-box-arrow-in-right');
  80  |   }
  81  | 
  82  |   readonly uniqueElement: Locator = this.ordersListTitle;
  83  | 
  84  |   @logStep('Get Orders List Title')
  85  |   async getOrdersListTitle() {
  86  |     return this.ordersListTitle.innerText();
  87  |   }
  88  | 
  89  |   @logStep('Click Create Order Button')
  90  |   async clickCreateOrderButton() {
  91  |     await this.createOrderButton.click();
  92  |   }
  93  | 
  94  |   @logStep('Fill Search Input Field on Orders List')
  95  |   async fillSearchInputField(searchText: string) {
  96  |     await this.searchInputField.fill(searchText);
  97  |   }
  98  | 
  99  |   @logStep('Click Search Button on Orders List')
  100 |   async clickSearchButton() {
  101 |     await this.searchButton.click();
  102 |   }
  103 | 
  104 |   @logStep('Click Filter Button on Orders List')
  105 |   async clickFilterButton() {
  106 |     await this.filterButton.click();
  107 |   }
  108 | 
  109 |   @logStep('Get Cell Text By Order Number And Column ')
  110 |   async getCellTextByOrderNumberAndColumn(orderNumber: string, columnName: OrdersListColumn) {
  111 |     const row = this.tableRowByOrderNumber(orderNumber);
  112 |     const headerTexts = await this.tableHeader.locator('th > div > div').allTextContents();
  113 |     const columnIndex = headerTexts.indexOf(columnName);
  114 | 
  115 |     const cell = row.locator('td').nth(columnIndex);
  116 |     return await cell.innerText();
  117 |   }
  118 | 
  119 |   @logStep('Click Details Button on Orders List')
  120 |   async clickDetailsButton(orderNumber: string): Promise<void> {
> 121 |     await this.getActionButtonInRow(orderNumber, 'details').click();
      |                                                             ^ Error: locator.click: Target page, context or browser has been closed
  122 |   }
  123 | 
  124 |   @logStep('Click Reopen Button on Orders List')
  125 |   async clickReopenButton(orderNumber: string): Promise<void> {
  126 |     await this.getActionButtonInRow(orderNumber, 'reopen').click();
  127 |   }
  128 | 
  129 |   private getActionButtonInRow(orderNumber: string, actionType: 'details' | 'reopen'): Locator {
  130 |     const row = this.tableRowByOrderNumber(orderNumber);
  131 |     const titleText = actionType === 'details' ? 'Details' : 'Reopen';
  132 |     return row.getByTitle(titleText, { exact: true });
  133 |   }
  134 | 
  135 |   @logStep('Click Column Header For Sort on Orders List')
  136 |   async clickColumnHeaderForSort(columnName: OrdersListColumnForSorting) {
  137 |     const columnHeader = this.tableHeader.locator('th div[onclick*="sortOrdersInTable"]', { hasText: columnName });
  138 |     await columnHeader.click();
  139 |   }
  140 | 
  141 |   async getCurrentSortDirection(columnName: OrdersListColumnForSorting) {
  142 |     return await test.step(`Get current sort direction for column ${columnName} on Orders List`, async () => {
  143 |       const columnHeader = this.getSortableColumnHeaderLocator(columnName);
  144 | 
  145 |       const [current, direction] = await Promise.all([columnHeader.getAttribute('current'), columnHeader.getAttribute('direction')]);
  146 |       return current === 'true' && (direction === 'asc' || direction === 'desc') ? direction : 'none';
  147 |     });
  148 |   }
  149 | 
  150 |   async sortColumnBy(columnName: OrdersListColumnForSorting, direction: SortDirection) {
  151 |     return await test.step(`Sort column ${columnName} by ${direction} direction on Orders List`, async () => {
  152 |       for (let i = 0; i < 3; i++) {
  153 |         const currentDirection = await this.getCurrentSortDirection(columnName);
  154 |         if (currentDirection === direction) {
  155 |           return;
  156 |         }
  157 | 
  158 |         await this.clickColumnHeaderForSort(columnName);
  159 |         await this.page.waitForTimeout(300);
  160 |       }
  161 |     });
  162 |   }
  163 | 
  164 |   @logStep('Get Row Count on Orders List')
  165 |   async getRowCount() {
  166 |     return await this.allTableRows.count();
  167 |   }
  168 | 
  169 |   @logStep('Select Items Per Page on Orders List')
  170 |   async selectItemsPerPage(itemsPerPage: '10' | '25' | '50' | '100') {
  171 |     await this.paginationSelect.selectOption(itemsPerPage);
  172 |   }
  173 | 
  174 |   @logStep('Click Previous Page Button on Orders List')
  175 |   async clickPreviousPageButton() {
  176 |     await this.previousPageButton.click();
  177 |   }
  178 | 
  179 |   @logStep('Click Next Page Button on Orders List')
  180 |   async clickNextPageButton() {
  181 |     await this.nextPageButton.click();
  182 |   }
  183 | 
  184 |   @logStep('Click Page Number Button on Orders List')
  185 |   async clickPageNumberButton(pageNumber: number) {
  186 |     const button = this.getPageByNumber(pageNumber);
  187 |     await button.click();
  188 |   }
  189 | }
  190 | 
```