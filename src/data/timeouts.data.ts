/**
 * Centralized timeout constants for UI operations.
 * Using named constants instead of magic numbers improves readability and maintainability.
 */

export const TIMEOUTS = {
  /** Default timeout for page load operations */
  PAGE_LOAD: 30000,

  /** Timeout for datepicker to become visible */
  DATEPICKER_VISIBLE: 5000,

  /** Timeout for spinner to disappear */
  SPINNER_HIDDEN: 10000,

  /** Timeout for modal to close */
  MODAL_CLOSE: 5000,

  /** Timeout for element to be visible */
  ELEMENT_VISIBLE: 10000,

  /** Timeout for element to be clickable */
  ELEMENT_CLICKABLE: 5000,

  /** Short timeout for quick operations */
  SHORT: 2000,
} as const;

export type TimeoutKey = (typeof TIMEOUTS)[keyof typeof TIMEOUTS];
