import { ObjectId } from 'bson';

/**
 * Generates a valid MongoDB ObjectId format that is guaranteed to not exist in the database.
 * This is useful for negative tests that require a non-existent ID.
 */
export function generateNonExistentId(): string {
  return new ObjectId().toHexString();
}

/**
 * Generates an invalid ID format (not a valid ObjectId) for testing malformed ID scenarios.
 */
export function generateInvalidIdFormat(): string {
  return 'invalid_id_format';
}
