import { test } from '@playwright/test';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});
addFormats(ajv);

export function validateSchema(expectedSchema: object, body: object) {
  return test.step('Validate JSON schema', () => {
    const validate = ajv.compile(expectedSchema);
    const isValid = validate(body);

    if (!isValid) {
      const errorDetails = validate.errors
        ?.map((err) => `Field: ${err.instancePath} | Error: ${err.message} | Params: ${JSON.stringify(err.params)}`)
        .join('\n');

      throw new Error(`Schema validation failed:\n${errorDetails}`);
    }
  });
}
