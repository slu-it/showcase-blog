import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';
import {of} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {BlogPostList} from './blog-post-list';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {ContextService} from '../../common/context/context.service';
import {BlogPostPreview} from '../../common/blog-posts/preview/blog-post-preview';
import {Pagination} from './pagination/pagination';
import {TestDataGenerator} from '../../common/test-data-generator/test-data-generator';
import {BlogPost, BlogPostsPage} from '../../common/blog-posts/blog-posts.model';

const post1: BlogPost = {
  uid: 'post-1', title: 'First Post', summary: 'Summary 1', content: '',
  publicationTime: '2025-06-15T14:30:00.000Z',
  _links: {self: {href: '/api/blog-posts/post-1'}},
};

const post2: BlogPost = {
  uid: 'post-2', title: 'Second Post', summary: 'Summary 2', content: '',
  publicationTime: '2025-06-16T10:00:00.000Z',
  _links: {self: {href: '/api/blog-posts/post-2'}},
};

const page: BlogPostsPage = {
  _embedded: {blogPosts: [post1, post2]},
  page: {size: 10, totalElements: 2, totalPages: 1, number: 1},
};

const emptyPage: BlogPostsPage = {
  page: {size: 10, totalElements: 0, totalPages: 1, number: 1},
};

describe('BlogPostList', () => {
  let fixture: ComponentFixture<BlogPostList>;
  let router: Router;
  let backend: { getBlogPostsPage: jest.Mock; deleteBlogPost: jest.Mock };

  const setupWithUser = async (isAdmin: boolean, responsePage: BlogPostsPage = page) => {
    backend = {
      getBlogPostsPage: jest.fn().mockReturnValue(of(responsePage)),
      deleteBlogPost: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BlogPostList, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: BlogPostsService, useValue: backend},
        {provide: ContextService, useValue: {user: () => ({username: 'alice', isAuthor: false, isAdmin})}},
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(BlogPostList);
    fixture.detectChanges();
  };

  const findPreviews = () =>
    fixture.debugElement.queryAll(By.directive(BlogPostPreview));

  const findPaginations = () =>
    fixture.debugElement.queryAll(By.directive(Pagination));

  const findTestDataGenerator = () =>
    fixture.debugElement.query(By.directive(TestDataGenerator));

  const findEmptyMessage = () =>
    fixture.debugElement.query(By.css('.empty-blog-post-list'));

  describe('loading', () => {
    it('should load page 1 on init', async () => {
      await setupWithUser(false);

      expect(backend.getBlogPostsPage).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('rendering', () => {
    it('should render a blog post preview for each post', async () => {
      await setupWithUser(false);

      expect(findPreviews()).toHaveLength(2);
    });
  });

  describe('pagination', () => {
    it('should load the requested page when pagination emits', async () => {
      await setupWithUser(false);

      findPaginations()[0].componentInstance.pageChanged.emit(3);

      expect(backend.getBlogPostsPage).toHaveBeenCalledWith(3, 10);
    });
  });

  describe('reloading', () => {
    it('should load the current page', async () => {
      await setupWithUser(false);

      fixture.componentInstance.reloadPage();

      expect(backend.getBlogPostsPage).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('edit', () => {
    it('should navigate to the edit page when edit is clicked', async () => {
      await setupWithUser(false);

      findPreviews()[0].componentInstance.editClicked.emit('post-1');

      expect(router.navigate).toHaveBeenCalledWith(['/edit', 'post-1']);
    });
  });

  describe('delete', () => {
    it('should delete the post and reload the current page on success', async () => {
      await setupWithUser(false);
      backend.deleteBlogPost.mockReturnValue(of(undefined));
      backend.getBlogPostsPage.mockClear();

      findPreviews()[0].componentInstance.deleteClicked.emit('post-1');

      expect(backend.deleteBlogPost).toHaveBeenCalledWith('post-1');
      expect(backend.getBlogPostsPage).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('empty blog post list', () => {
    it('should show empty message when there are no blog posts', async () => {
      await setupWithUser(false, emptyPage);

      expect(findEmptyMessage()).toBeTruthy();
    });

    it('should not show blog post previews when there are no blog posts', async () => {
      await setupWithUser(false, emptyPage);

      expect(findPreviews()).toHaveLength(0);
    });

    it('should not show pagination when there are no blog posts', async () => {
      await setupWithUser(false, emptyPage);

      expect(findPaginations()).toHaveLength(0);
    });

    it('should not show empty message when there are blog posts', async () => {
      await setupWithUser(false);

      expect(findEmptyMessage()).toBeNull();
    });
  });

  describe('test data generator', () => {
    it('should show the test data generator when the user is an admin', async () => {
      await setupWithUser(true);

      expect(findTestDataGenerator()).toBeTruthy();
    });

    it('should not show the test data generator when the user is not an admin', async () => {
      await setupWithUser(false);

      expect(findTestDataGenerator()).toBeNull();
    });
  });
});
