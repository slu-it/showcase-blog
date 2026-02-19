import {expect, Page} from '@playwright/test';

export class CreatorPage {
  private readonly url = '/create';
  private readonly title = 'Blog Post Creator';

  constructor(private readonly page: Page) {}

  async assertIsDisplayed() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.page).toHaveTitle(this.title);
  }

  async fillTitle(value: string) {
    await this.page.locator('#title').fill(value);
  }

  async fillSummary(value: string) {
    await this.page.locator('#summary').fill(value);
  }

  async fillContent(value: string) {
    await this.page.locator('#content').fill(value);
  }

  async submit() {
    await this.page.locator('button.submit').click();
  }
}
