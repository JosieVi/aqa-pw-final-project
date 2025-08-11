Отлично 👍
Вот полный объединённый и оформленный `README.md` в одном куске — можно копировать целиком:

````markdown
# 🎯 AQA Playwright Final Project

[![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-45ba4b?logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Lint](https://img.shields.io/badge/Lint-ESLint-4B32C3?logo=eslint)](https://eslint.org/)
[![Formatter](https://img.shields.io/badge/Format-Prettier-F7B93E?logo=prettier)](https://prettier.io/)

📌 **Final course project for Automated Quality Assurance (AQA) using Playwright and TypeScript.**  
Covers **UI tests**, **API tests**, **reporting**, and **code quality tools**.

---

## 🚀 Installation Guide

### 1️⃣ Clone the Repository
Install [Git Bash](https://git-scm.com/downloads/win), open the folder where you want the project, and run:
```bash
git clone https://github.com/origamerpro/aqa-pw-final-project.git
````

---

### 2️⃣ Open the Project

1. Navigate to the project folder.
2. Open it in [VS Code](https://code.visualstudio.com/Download).
3. Open the terminal — you should see something like:

```bash
aqa-pw-final-project (main)
```

---

### 3️⃣ Install TypeScript (if not already installed)

```bash
npm i -g typescript --save-dev
npm i -g ts-node
```

---

### 4️⃣ Install Dependencies

```bash
npm install
```

---

### 5️⃣ Verify Installed Packages

```bash
npm list
```
---

### 6️⃣ Configure Environment Variables

Create a `.env` file in the root folder:

```bash
USER_LOGIN=yourlogin
USER_PASSWORD=yourpassword
```

💡 Check `.env.dist` for a commented example.

---

## 🧪 Running Tests

### 🔹 UI Tests

```bash
npm run test:ui   # Run all UI tests
npm run ui-mode   # Open Playwright UI mode
```

### 🔹 API Tests

```bash
npm run test:api
```

---

## 🛠 Code Quality

```bash
npm run lint        # Check code for linting issues
npm run lint-fix    # Fix linting issues
npm run format      # Check formatting
npm run format-fix  # Fix formatting
```

---

## 📊 Reporting

```bash
npm run report-html-open   # Open Playwright HTML report
npm run allure-report      # Generate Allure report
npm run allure-report-open # Open Allure report
```

---

## 🔄 Git Commands

```bash
git commit -m "commit message"          # Commit changes
git commit -am "commit message" -n      # Commit without lint/format checks
```

---

## 📂 Project Structure

```
aqa-pw-final-project
├── .env.dist
├── .eslintignore
├── .eslintrc.cjs
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
├── tsconfig.json
├── src
│   ├── api
│   │   ├── clients
│   │   │   ├── products.controller.ts
│   │   │   ├── signin.controller.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── customers.controller.ts
│   │   ├── controllers
│   │   │   └── request.ts
│   │   └── services
│   │       ├── customers.api-service.ts
│   │       ├── signin.api-service.ts
│   │       ├── orders.api-service.ts
│   │       └── product.api-service.ts
│   ├── tests
│   │   ├── customers
│   │   ├── orders
│   │   └── products
│   ├── ui
│   │   ├── pages
│   │   │   ├── modals
│   │   │   │   └── baseDelivery.page.ts
│   │   │   ├── orders
│   │   │   │   └── scheduleDelivery.page.ts
│   │   │   ├── base.page.ts
│   │   │   ├── home.page.ts
│   │   │   ├── pageHolder.page.ts
│   │   │   └── signin.page.ts
│   │   └── services
│   │       ├── home.ui-service.ts
│   │       ├── order.ui-service.ts
│   │       ├── orderDetails.ui-service.ts
│   │       ├── orderSetup.ui-service.ts
│   │       └── signin.ui-service.ts
│   └── utils
│       ├── validations
│       │   ├── responseValidation.ts
│       │   ├── schemaValidation.ts
│       │   └── dataDisposal.utils.ts
│       ├── date.utils.ts
│       ├── enum.utils.ts
│       ├── helper.ts
│       ├── requestParams.utils.ts
│       ├── reporter.utils.ts
│       └── generateUniqueId.utils.ts
└── tests
    ├── api-services.fixture.ts
    ├── controllers.fixture.ts
    ├── index.fixture.ts
    ├── mock.fixture.ts
    ├── orders.fixture.ts
    ├── ordersCustom.fixture.ts
    ├── pages.fixture.ts
    ├── products.fixture.ts
    ├── tests
    │   ├── orders
    │   ├── products
    │   └── ui
    │       ├── checkUI
    │       ├── criticalPath
    │       └── smoke
    ├── ui-services.fixture.ts
    └── auth.setup.ts

```

---

## 🏆 Technologies Used

* 🎭 [Playwright](https://playwright.dev/) — E2E testing framework
* 💙 [TypeScript](https://www.typescriptlang.org/) — Typed JavaScript
* 📏 [ESLint](https://eslint.org/) — Code linting
* 🎨 [Prettier](https://prettier.io/) — Code formatting
* 📈 [Allure](https://docs.qameta.io/allure/) — Beautiful test reports
