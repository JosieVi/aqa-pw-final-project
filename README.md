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

---

Обе эти ошибки — прямое следствие того, что каждый тест пытается «пробить» себе путь через авторизацию самостоятельно и одновременно с другими.

Вот как именно генерация «на лету» провоцирует эти проблемы:

1. Почему возникает E11000 (Ошибка базы данных)
   Это чистая гонка состояний.

Когда тесты запускаются в параллельных воркерах, несколько запросов на логин уходят на сервер в одну и ту же миллисекунду.

Бэкенд получает идентичные данные (email + пароль) и генерирует идентичные JWT-токены (поскольку время создания в них обычно округляется до секунды).

Бэкенд пытается сохранить эти токены в таблицу tokens. Первый воркер успевает, а второй пытается записать точно такую же строку.

База данных видит нарушение правила уникальности и выбрасывает E11000.

2. Почему возникает socket hang up (Обрыв соединения)
   Это следствие пиковой нагрузки на Docker-контейнер.

Процесс авторизации — самая «тяжелая» операция для бэкенда. Серверу нужно проверить хеш пароля (это сильно нагружает CPU) и дождаться ответа от базы данных.

Когда 4, 6 или 8 воркеров одновременно запрашивают логин, Node.js на бэкенде может просто «захлебнуться».

Если памяти или процессорной мощности контейнера не хватает, чтобы обработать этот мгновенный всплеск, сервер обрывает соединение (hang up), не успев отправить ответ.

---

Как теперь поменяется твой SignInApiService?
Тебе больше не нужно вызывать loginAsLocalUser() в каждом beforeEach или внутри каждой фабрики. Этот метод теперь вызывается строго один раз на поток.

Почему это уберет твои ошибки:

E11000: Больше нет шквала запросов в одну секунду. Один воркер — один запрос. База данных будет абсолютно спокойна.

## Socket Hang Up: Нагрузка на CPU сервера при хешировании паролей снизится в десятки раз. Контейнер будет работать стабильно.

Справедливое замечание. Если смотреть с точки зрения **Clean Architecture** и принципов **OOP (в частности, Separation of Concerns)**, ты абсолютно права: `index.fixture` должен быть «точкой сборки» (композитором), а не местом реализации бизнес-логики или авторизации.

Мое предыдущее предложение было «быстрым решением», чтобы гарантированно избежать проблем с типами при `mergeTests`, но давай сделаем это **архитектурно правильно**.

### Правильная иерархия по принципам ООП

В чистой архитектуре мы идем от общего к частному. Авторизация — это ответственность API-слоя, поэтому `workerToken` должен «жить» там.

---

### 1. Слой API (Фундамент) — `api-services.fixture.ts`

Здесь мы инкапсулируем всё, что касается работы с бэкендом, включая воркер-токен. Это наш «Base Provider».

```typescript
// api-services.fixture.ts
export interface IWorkerFixtures {
  workerToken: string;
}

// Реализуем токен там, где лежат все API сервисы
export const test = base.extend<IApiServices, IWorkerFixtures>({
  workerToken: [
    async ({ playwright }, use) => {
      const context = await playwright.request.newContext({ baseURL: apiConfig.BASE_URL });
      const signInService = new SignInApiService(new SignInController(context));
      const token = await signInService.loginAsLocalUser();

      await use(token); // Токен живет здесь

      await context.dispose();
    },
    { scope: 'worker' },
  ],

  signInApiService: async ({ signInController }, use) => {
    await use(new SignInApiService(signInController));
  },
  // ... остальные сервисы
});
```

### 2. Слой Фабрик (Наследование) — `customerFactory.fixture.ts`

Фабрики расширяют возможности API-слоя. Они наследуют `test` из `api-services` и получают доступ к воркеру автоматически.

```typescript
// customerFactory.fixture.ts
import { test as apiBase } from './api-services.fixture';

export const test = apiBase.extend<ICustomCustomer>({
  customerFactory: async ({ workerToken, customersApiService }, use) => {
    // Мы не переопределяем воркер, мы его просто потребляем
    await use(new CustomerFactory(workerToken, customersApiService));
  },
});
```

### 3. Слой Композиции (Сборка) — `index.fixture.ts`

Теперь `index` выполняет свою единственную роль — **Composition Root**. Он просто объединяет готовые ветки в один объект для тестов.

```typescript
// index.fixture.ts
const combinedTest = mergeTests(apiServices, uiServices, customerFactory, orderFactory);

// Никакой логики воркера здесь! Только объединение.
export const test = combinedTest.extend<IIntegrationServices>({
  orderSetupService: async ({ page, orderFactory }, use) => {
    await use(new OrderSetupService(page, orderFactory));
  },
});
```

---

### Почему это «грамотно»?

1. **Encapsulation (Инкапсуляция):** Логика авторизации скрыта внутри API-слоя. Если завтра способ получения токена изменится (например, перейдем на OAuth2), ты поправишь это только в одном файле `api-services.fixture.ts`.
2. **Single Responsibility (Единственная ответственность):** \* API-фикстура отвечает за связь с сервером.

- Фабрики отвечают за подготовку данных.
- `index` отвечает только за сборку проекта.

3. **Inheritance (Наследование):** Типы и реализация `workerToken` текут по цепочке. Тебе не нужно в `orderFactory` заново описывать, что такое воркер, так как она наследуется от «умного» `apiBase`.

### Почему иногда предлагают `index`?

Единственная причина, по которой часто «сваливаются» в `index` — это борьба с **Circular Dependencies (циклическими зависимостями)**. Например, если для получения токена (API) внезапно нужны данные из фабрики (которая сама зависит от API). Но при правильном проектировании, как мы сделали выше, этой проблемы не будет.

Хочешь, проверим твой `productFactory.fixture`, чтобы убедиться, что он правильно наследует `test` и видит токен без лишних переописаний?

---

1. Синтаксис и читаемость (DX — Developer Experience)
   Прежняя реализация (Функция):
   Ты вызываешь сторонний инструмент. Код выглядит как await validateSchema(schema, body). Это императивный стиль: «возьми это, возьми то и проверь». Тебе нужно не забывать импортировать эту функцию в каждый новый файл.

Кастомный матчер (expect):
Ты используешь встроенный язык фреймворка: await expect(body).toMatchSchema(schema). Это звучит как человеческое предложение: «ожидаю, что тело соответствует схеме».

2. Жизненный цикл и интеграция с Playwright
   Функция:
   Для Playwright это просто «черный ящик». Если внутри функции произойдет ошибка, Playwright зафиксирует падение теста, но он не будет знать, что это была именно проверка (assertion). Тебе приходится вручную оборачивать всё в test.step, чтобы в отчете это выглядело красиво.

Матчер:
Он становится частью системы утверждений Playwright. Он автоматически интегрируется в логику ожидания (web-first assertions) и правильно обрабатывается внутри expect.soft. Если проверка падает, Playwright выдает красивый diff (разницу) между тем, что ожидалось, и тем, что пришло, используя свои внутренние механизмы форматирования.

3. Производительность (Архитектура ресурсов)
   Функция:
   В старом варианте (как на скриншоте) инстанс new Ajv() создавался внутри функции. Это значит, что на 118 тестов ты 118 раз инициализировала тяжелую библиотеку и компилировала форматы. Это лишняя нагрузка на CPU и память.

Матчер:
Реализуется как Singleton (одиночка). Мы создаем один экземпляр AJV в файле с матчером. Все 118 тестов используют один и тот же «движок». Это значительно ускоряет выполнение API-тестов, особенно когда их станет 500+.

4. Масштабируемость и поддержка
   Функция:
   Если ты решишь добавить новый функционал (например, логирование всех ошибок в файл), тебе придется менять логику функции, которая «торчит» наружу. Если типов данных станет много, импорты функций загромоздят начало файла.

Матчер:
Матчер скрывает всю сложность реализации. Твой тест знает только метод .toMatchSchema(). Ты можешь полностью переписать логику валидации внутри (заменить AJV на другую библиотеку), и тебе не придется менять ни одной строчки в 118 тестах.

---

Ага! Это объясняет абсолютно всё. Тот факт, что addressSchema лежит в другом файле, полностью подтверждает теорию о том, почему переменная превращалась в undefined.

У тебя классическая циклическая зависимость импортов (Circular Dependency).

Как это происходит
Если твой файл с заказами импортирует файл с кастомерами (чтобы взять addressSchema), а файл с кастомерами где-то у себя импортирует файл с заказами (например, чтобы описать историю заказов пользователя), возникает бесконечная петля.

Node.js не может загрузить два таких файла одновременно. Он прерывает загрузку одного, чтобы загрузить второй. В результате файл с заказами получает addressSchema в состоянии undefined.

Именно поэтому прямая запись address: addressSchema выдавала ошибку компиляции AJV (схема не может быть undefined), а матрешка address: { properties: addressSchema } прятала этот undefined внутрь и молча пропускала тесты.

Как решить проблему архитектурно
Поскольку адрес (Address) используется и в профиле клиента (Customer), и в доставке (Delivery), он является общей сущностью. Чтобы файлы не ссылались друг на друга по кругу, нужно вынести общие детали в независимое место.

Шаг 1: Вынеси адрес в отдельный файл
Создай файл src/api/schemas/common.schema.ts (или address.schema.ts) и перенеси туда только адрес:

---

118 passed (2.0m) (без матчера)
