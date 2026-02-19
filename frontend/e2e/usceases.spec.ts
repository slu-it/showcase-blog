import {test} from '@playwright/test';
import {ConfirmationDialogPage} from './pages/confirmation-dialog.page';
import {CreatorPage} from './pages/creator.page';
import {HomePage} from './pages/home.page';
import {ViewerPage} from './pages/viewer.page';
import {stubDeleteBlogPost, stubGetBlogPost, stubGetBlogPosts, stubGetContext, stubPostBlogPosts} from './api.stubs';

const TEST_POST_UID = 'e2e-test-blog-post-uid';
const TEST_POST_TITLE = 'E2E Test Blog Post';
const TEST_POST_SUMMARY = 'Short summary written for the e2e test scenario.';
const TEST_POST_CONTENT = 'Brief content written for the e2e test scenario.';

const TEST_BLOG_POST = {
  uid: TEST_POST_UID,
  title: TEST_POST_TITLE,
  summary: TEST_POST_SUMMARY,
  content: TEST_POST_CONTENT,
  publicationTime: '2026-02-19T12:00:00Z',
  _links: {
    self: {href: `/api/blog-posts/${TEST_POST_UID}`},
    patch: {href: `/api/blog-posts/${TEST_POST_UID}`},
    delete: {href: `/api/blog-posts/${TEST_POST_UID}`},
  },
};

test.describe('Blog Post CRUD', () => {

  test('should create, view and delete a blog post as an author', async ({page}) => {
    const homePage = new HomePage(page);
    const creatorPage = new CreatorPage(page);
    const viewerPage = new ViewerPage(page);
    const confirmationDialog = new ConfirmationDialogPage(page);

    // --- API mocks ---

    await stubGetContext(page, 200, {user: {username: 'author', isAuthor: true, isAdmin: false}});
    await stubGetBlogPosts(page, 200, {page: {size: 10, totalElements: 0, totalPages: 1, number: 1}});
    await stubPostBlogPosts(page, 201, TEST_BLOG_POST);
    await stubGetBlogPost(page, TEST_POST_UID, 200, TEST_BLOG_POST);
    await stubDeleteBlogPost(page, TEST_POST_UID, 204);

    // --- Test scenario ---

    // Open the homepage and switch to English first for locale stability
    await homePage.goto();
    await homePage.switchToEnglish();
    await homePage.assertIsDisplayed();

    // Navigate to the create page
    await homePage.clickCreate();
    await creatorPage.assertIsDisplayed();

    // Fill out the form (publication time is left at its pre-filled default)
    await creatorPage.fillTitle(TEST_POST_TITLE);
    await creatorPage.fillSummary(TEST_POST_SUMMARY);
    await creatorPage.fillContent(TEST_POST_CONTENT);

    // Submit the form
    await creatorPage.submit();

    // The app redirects to the viewer – verify the correct post is shown
    await viewerPage.assertIsDisplayed(TEST_POST_TITLE);

    // Trigger the delete action
    await viewerPage.clickDelete();

    // Confirm deletion in the dialog
    await confirmationDialog.assertIsDisplayed();
    await confirmationDialog.confirm();

    // After deletion the app navigates back to the home page
    await homePage.assertIsDisplayed();
  });

});
