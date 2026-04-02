import { test } from '@playwright/test';
/*
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export function validateSchema(expectedSchema: object, body: object) {
  return test.step('Validate response body against JSON schema', () => {
    const ajv = new Ajv();
    addFormats(ajv);
    const validate = ajv.compile(expectedSchema);

    const isValid = validate(body);

    if (!isValid) {
      console.log('Data is not valid according to the schema.');
      console.log(`Errors: ${JSON.stringify(validate.errors, null, 2)}`);
    }

    expect.soft(validate.errors == null, `Should not have JSON schema errors. Errors: ${JSON.stringify(validate.errors, null, 2)}`).toBe(true);
    expect.soft(isValid, `Expected isValid: true, but got: ${isValid}`).toBe(true);
  });
}
  */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Создаем один инстанс на весь проект
const ajv = new Ajv({
  allErrors: true, // Проверять все ошибки сразу, а не падать на первой
  verbose: true,
});
addFormats(ajv);

export function validateSchema(expectedSchema: object, body: object) {
  return test.step('Validate JSON schema', () => {
    const validate = ajv.compile(expectedSchema);
    const isValid = validate(body);

    // if (!isValid) {
    //   console.log('Data is not valid according to the schema.');
    //   console.log(`Errors: ${JSON.stringify(validate.errors, null, 2)}`);
    // }

    // expect.soft(validate.errors == null, `Should not have JSON schema errors. Errors: ${JSON.stringify(validate.errors, null, 2)}`).toBe(true);
    // expect.soft(isValid, `Expected isValid: true, but got: ${isValid}`).toBe(true);

    if (!isValid) {
      const errorDetails = validate.errors
        ?.map((err) => `Field: ${err.instancePath} | Error: ${err.message} | Params: ${JSON.stringify(err.params)}`)
        .join('\n');

      // Вместо простого console.log, выводим красиво структурированную ошибку
      throw new Error(`Schema validation failed:\n${errorDetails}`);
    }
  });
}
