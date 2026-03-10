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
git clone https://github.com/josievi/aqa-pw-final-project.git
```

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

📸 Example output:

```bash
"devDependencies": {
"@eslint/js": "9.29.0",
"@faker-js/faker": "9.7.0",
"@playwright/test": "1.51.1",
"@types/ajv": "0.0.5",
"@types/dotenv": "6.1.1",
"@types/lodash": "4.17.16",
"@types/moment": "2.11.29",
"@types/node": "22.14.1",
"@types/rimraf": "3.0.2",
"@typescript-eslint/eslint-plugin": "8.34.0",
"@typescript-eslint/parser": "8.34.0",
"ajv-formats": "3.0.1",
"ajv": "8.17.1",
"allure-commandline": "2.34.0",
"allure-playwright": "3.2.2",
"bson": "6.10.4",
"dotenv": "16.5.0",
"eslint-config-prettier": "10.1.5",
"eslint-plugin-prettier": "5.4.1",
"eslint": "9.29.0",
"globals": "16.2.0",
"husky": "9.1.7",
"lodash": "4.17.21",
"moment": "2.30.1",
"prettier": "3.5.3",
"rimraf": "6.0.1",
"typescript-eslint": "8.34.0"
}
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
QA-PW-FINAL-PROJECT
├── .husky                      # Git hooks
├── src                         # Project source code
│   ├── api                     # API clients, controllers, and services
│   ├── config                  # Configuration files
│   ├── data                    # Test data files
│   ├── fixtures                # Fixtures
│   ├── types                   # Custom types
│   ├── ui                      # Page Objects and UI services
│   └── utils                   # Helper functions and utilities
├── .env.dist                   # Template for environment variables
├── .gitignore                  # List of files to ignore
├── .prettierignore             # List of files to ignore for Prettier
├── .prettierrc                 # Prettier configuration
├── .eslintrc.cjs               # ESLint configuration
├── package-lock.json           # Locked versions of packages
├── package.json                # Dependencies list and scripts
├── playwright.config.ts        # Playwright configuration
├── README.md                   # Project documentation
└── tsconfig.json               # TypeScript configuration
```

---

## 🏆 Technologies Used

- 🎭 [Playwright](https://playwright.dev/) — E2E testing framework
- 💙 [TypeScript](https://www.typescriptlang.org/) — Typed JavaScript
- 📏 [ESLint](https://eslint.org/) — Code linting
- 🎨 [Prettier](https://prettier.io/) — Code formatting
- 📈 [Allure](https://docs.qameta.io/allure/) — Beautiful test reports

---

Инструкция по сбросу БД через Docker Desktop:
Открой терминал: Нажми на ту самую иконку CLI напротив твоего контейнера mongo-db в Docker Desktop. Откроется черное окно командной строки.

Запусти оболочку Mongo: Прямо в этом окне напиши команду и нажми Enter:
mongosh (если вдруг выдаст ошибку, что команда не найдена, значит образ старый, тогда напиши просто mongo).

Найди свою базу: Чтобы вспомнить, как точно называется база твоего проекта, введи:
show dbs

Выбери базу: Подключись к ней командой use:
use <имя*твоей*базы> (например: use aqa-shop)

Уничтожь данные: Выполни команду удаления:
db.dropDatabase()

Выйди: Напиши exit, чтобы выйти из оболочки Mongo.
