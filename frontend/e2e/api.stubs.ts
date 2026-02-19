import {Page} from '@playwright/test';

export function stubGetContext(page: Page, status: number, body: object): Promise<void> {
  return page.route('/api/context', route => {
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }
    return route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export function stubGetBlogPosts(page: Page, status: number, body: object): Promise<void> {
  return page.route('/api/blog-posts?*', route => {
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }
    return route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export function stubPostBlogPosts(page: Page, status: number, body: object): Promise<void> {
  return page.route('/api/blog-posts', route => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }
    return route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export function stubGetBlogPost(page: Page, uid: string, status: number, body: object): Promise<void> {
  return page.route(`/api/blog-posts/${uid}`, route => {
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }
    return route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export function stubDeleteBlogPost(page: Page, uid: string, status: number): Promise<void> {
  return page.route(`/api/blog-posts/${uid}`, route => {
    if (route.request().method() !== 'DELETE') {
      return route.fallback();
    }
    return route.fulfill({status});
  });
}
