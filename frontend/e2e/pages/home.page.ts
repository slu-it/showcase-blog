import {expect, Page} from '@playwright/test';

export class HomePage {
  private readonly url = '/';
  private readonly title = 'Blog Posts';

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(this.url);
  }

  async switchToEnglish() {
    await expect(this.page.locator('#language')).toBeVisible();
    await this.page.locator('#language').selectOption('en');
  }

  async assertIsDisplayed() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.page).toHaveTitle(this.title);
  }

  async clickCreate() {
    await this.page.getByRole('link', {name: 'Create'}).click();
  }

  get blogPostList() {
    return this.page.locator('.blog-post-list');
  }

  get emptyState() {
    return this.page.locator('.empty-blog-post-list');
  }
}
