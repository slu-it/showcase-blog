import {expect, Page, test} from '@playwright/test';

async function selectEnglish(page: Page) {
  await expect(page.locator('#language')).toBeVisible();
  await page.locator('#language').selectOption('en');
}

function mockContextToBeSimpleUser(page: Page) {
  return page.route('/api/context', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: {username: 'user', isAuthor: false, isAdmin: false}
    }),
  }));
}

test.describe('Blog Post List', () => {

  test('should show empty state when there are no blog posts', async ({page}) => {
    await mockContextToBeSimpleUser(page);

    await page.route('/api/blog-posts?*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        page: {size: 10, totalElements: 0, totalPages: 1, number: 1}
      }),
    }));

    await page.goto('/');
    await selectEnglish(page);

    // Empty state message should be shown
    const emptyState = page.locator('.empty-blog-post-list');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('There are no blog posts, yet.');
  });

  test('should list blog posts when they exist', async ({page}) => {
    await mockContextToBeSimpleUser(page);

    await page.route('/api/blog-posts?*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        _embedded: {
          blogPosts: [
            {
              uid: 'post-1',
              title: 'First Blog Post',
              summary: 'Summary of the first post',
              content: 'Content of the first post',
              publicationTime: '2026-01-15T10:00:00',
              _links: {self: {href: '/api/blog-posts/post-1'}}
            },
            {
              uid: 'post-2',
              title: 'Second Blog Post',
              summary: 'Summary of the second post',
              content: 'Content of the second post',
              publicationTime: '2026-02-01T12:00:00',
              _links: {self: {href: '/api/blog-posts/post-2'}}
            }
          ]
        },
        page: {size: 10, totalElements: 1, totalPages: 1, number: 1}
      }),
    }));

    await page.goto('/');
    await selectEnglish(page);

    // Blog post list should be visible
    const blogPostList = page.locator('.blog-post-list');
    await expect(blogPostList).toBeVisible();

    // Both blog posts should be listed
    const posts = blogPostList.locator('.blog-post-list-entry');
    await expect(posts).toHaveCount(2);
    await expect(posts.nth(0)).toContainText('First Blog Post');
    await expect(posts.nth(1)).toContainText('Second Blog Post');
  });
});
