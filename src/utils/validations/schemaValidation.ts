import { expect, test } from '@playwright/test';
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

    expect.soft(validate.errors == null, 'Should not have JSON schema errors').toBe(true);
    expect.soft(isValid, 'Schema validation result').toBe(true);
  });
}
