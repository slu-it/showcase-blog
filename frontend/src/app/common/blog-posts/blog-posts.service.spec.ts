import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {BlogPostsService} from './blog-posts.service';
import {NotificationsService} from '../notifications/notifications.service';
import {BlogPost, BlogPostDto, BlogPostsPage, BlogPostUpdateDto} from './blog-posts.model';

describe('BlogPostsService', () => {
  let service: BlogPostsService;
  let httpTesting: HttpTestingController;
  let notifications: { publishInfo: jest.Mock; publishError: jest.Mock };

  const blogPost: BlogPost = {
    uid: 'abc-123',
    title: 'Test Post',
    summary: 'A summary',
    content: '# Hello',
    publicationTime: '2025-06-15T14:30:00.000Z',
    _links: {self: {href: '/api/blog-posts/abc-123'}},
  };

  beforeEach(() => {
    notifications = {publishInfo: jest.fn(), publishError: jest.fn()};

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: NotificationsService, useValue: notifications},
      ],
    });

    service = TestBed.inject(BlogPostsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('createBlogPost', () => {
    const dto: BlogPostDto = {title: 'Test Post', publicationTime: '2025-06-15T14:30:00.000Z'};

    it('should POST to /api/blog-posts and return the created blog post', () => {
      let result: BlogPost | undefined;
      service.createBlogPost(dto).subscribe(res => (result = res));

      const req = httpTesting.expectOne('/api/blog-posts');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(blogPost);

      expect(result).toEqual(blogPost);
    });

    it('should publish an info notification on success', () => {
      service.createBlogPost(dto).subscribe();

      httpTesting.expectOne('/api/blog-posts').flush(blogPost);

      expect(notifications.publishInfo).toHaveBeenCalledWith('notifications.created');
    });

    it('should publish an error notification on failure', () => {
      service.createBlogPost(dto).subscribe();

      httpTesting.expectOne('/api/blog-posts').flush(null, {status: 500, statusText: 'Internal Server Error'});

      expect(notifications.publishError).toHaveBeenCalledWith('notifications.failedToCreate');
    });
  });

  describe('updateBlogPost', () => {
    const dto: BlogPostUpdateDto = {title: 'Updated Post'};

    it('should PATCH to /api/blog-posts/:uid and return the updated blog post', () => {
      let result: BlogPost | undefined;
      service.updateBlogPost('abc-123', dto).subscribe(res => (result = res));

      const req = httpTesting.expectOne('/api/blog-posts/abc-123');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(blogPost);

      expect(result).toEqual(blogPost);
    });

    it('should publish an info notification on success', () => {
      service.updateBlogPost('abc-123', dto).subscribe();

      httpTesting.expectOne('/api/blog-posts/abc-123').flush(blogPost);

      expect(notifications.publishInfo).toHaveBeenCalledWith('notifications.updated');
    });

    it('should publish an error notification on failure', () => {
      service.updateBlogPost('abc-123', dto).subscribe();

      httpTesting.expectOne('/api/blog-posts/abc-123').flush(null, {status: 500, statusText: 'Internal Server Error'});

      expect(notifications.publishError).toHaveBeenCalledWith('notifications.failedToUpdate');
    });
  });

  describe('deleteBlogPost', () => {
    it('should DELETE to /api/blog-posts/:uid', () => {
      service.deleteBlogPost('abc-123').subscribe();

      const req = httpTesting.expectOne('/api/blog-posts/abc-123');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should publish an info notification on success', () => {
      service.deleteBlogPost('abc-123').subscribe();

      httpTesting.expectOne('/api/blog-posts/abc-123').flush(null);

      expect(notifications.publishInfo).toHaveBeenCalledWith('notifications.deleted');
    });

    it('should publish an error notification on failure', () => {
      service.deleteBlogPost('abc-123').subscribe();

      httpTesting.expectOne('/api/blog-posts/abc-123').flush(null, {status: 500, statusText: 'Internal Server Error'});

      expect(notifications.publishError).toHaveBeenCalledWith('notifications.failedToDelete');
    });
  });

  describe('getBlogPost', () => {
    it('should GET from /api/blog-posts/:uid and return the blog post', () => {
      let result: BlogPost | undefined;
      service.getBlogPost('abc-123').subscribe(res => (result = res));

      const req = httpTesting.expectOne('/api/blog-posts/abc-123');
      expect(req.request.method).toBe('GET');
      req.flush(blogPost);

      expect(result).toEqual(blogPost);
    });
  });

  describe('getBlogPostsPage', () => {
    it('should GET from /api/blog-posts with pageNumber and pageSize params', () => {
      const page: BlogPostsPage = {
        _embedded: {blogPosts: [blogPost]},
        page: {size: 10, totalElements: 1, totalPages: 1, number: 0},
      };

      let result: BlogPostsPage | undefined;
      service.getBlogPostsPage(1, 10).subscribe(res => (result = res));

      const req = httpTesting.expectOne(r => r.url === '/api/blog-posts');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('pageNumber')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush(page);

      expect(result).toEqual(page);
    });
  });
});
