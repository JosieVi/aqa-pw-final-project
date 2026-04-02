import { expect as baseExpect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Уровень 1: Создаем один инстанс AJV на весь проект
const ajv = new Ajv({
  allErrors: true, // Находим все ошибки схемы сразу
  verbose: true, // Даем больше контекста об ошибках
});
addFormats(ajv);

export const expect = baseExpect.extend({
  // Наш кастомный матчер
  async toMatchSchema(received: any, schema: object) {
    const validate = ajv.compile(schema);
    const pass = validate(received);

    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      };
    } else {
      // Уровень 3: Форматируем ошибки так, чтобы их было легко читать
      const errorDetails = validate.errors?.map((err) => `  - Поле: "${err.instancePath}" | Ошибка: ${err.message}`).join('\n');

      return {
        message: () => `Результат не соответствует JSON-схеме:\n${errorDetails}\n\nПолученные данные: ${JSON.stringify(received, null, 2)}`,
        pass: false,
      };
    }
  },
});
