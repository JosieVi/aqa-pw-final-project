import { Locator, Page } from '@playwright/test';

/**
 * Interface defining the basic contract for all Page Objects in the UI test framework.
 * This ensures consistency across all page classes and enables proper typing.
 */
export interface IPage {
  /**
   * The Playwright Page instance used for interactions
   */
  readonly page: Page;

  /**
   * A unique element that identifies this page.
   * Used for waiting until the page is fully loaded.
   */
  readonly uniqueElement: Locator;
}

/**
 * Interface for pages that can be waited for (extends IPage with navigation methods)
 */
export interface INavigablePage extends IPage {
  /**
   * Waits for the page to be opened and all initial loads to complete.
   * Should wait for the uniqueElement to be visible and any spinners to disappear.
   */
  waitForOpened(): Promise<void>;

  /**
   * Waits for any loading spinners to disappear.
   * Useful after actions that trigger server requests.
   */
  waitForSpinner(): Promise<void>;
}

/**
 * Interface for modal components that extend basic page functionality
 */
export interface IModal extends INavigablePage {
  /**
   * Closes the modal using the close button
   */
  clickCloseButton(): Promise<void>;

  /**
   * Cancels the modal using the cancel button
   */
  clickCancelButton(): Promise<void>;

  /**
   * Waits for the modal to be closed
   */
  waitForClosed(): Promise<void>;
}

/**
 * Interface for page components/sections that are part of a larger page
 */
export interface IPageComponent extends IPage {
  /**
   * Waits for the component to be visible
   */
  waitForOpened(): Promise<void>;
}
