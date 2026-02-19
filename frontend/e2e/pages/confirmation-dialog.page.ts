import {expect, Page} from '@playwright/test';

export class ConfirmationDialogPage {
  constructor(private readonly page: Page) {}

  async assertIsDisplayed() {
    await expect(this.page.locator('.overlay')).toBeVisible();
    await expect(this.page.locator('.dialog')).toBeVisible();
  }

  async confirm() {
    await this.page.locator('.dialog .yes').click();
  }

  async cancel() {
    await this.page.locator('.dialog .no').click();
  }
}
