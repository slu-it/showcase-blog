import {expect, Page} from '@playwright/test';

export class ViewerPage {
  private readonly urlPattern = /\/view\/.+/;
  private readonly title = 'Blog Post';

  constructor(private readonly page: Page) {}

  async assertIsDisplayed(postTitle: string) {
    await expect(this.page).toHaveURL(this.urlPattern);
    await expect(this.page).toHaveTitle(this.title);
    await expect(this.page.locator('.blog-post .title')).toContainText(postTitle);
  }

  async clickDelete() {
    await this.page.getByRole('button', {name: '🗑️'}).click();
  }
}
