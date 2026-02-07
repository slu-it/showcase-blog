import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {MarkdownModule} from 'ngx-markdown';
import {BlogPostViewer} from './blog-post-viewer';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {BlogPostView} from '../../common/blog-posts/view/blog-post-view';
import {ErrorState} from '../../common/error-state/error-state';
import {BlogPost} from '../../common/blog-posts/blog-posts.model';

const post: BlogPost = {
  uid: 'abc-123',
  title: 'Test Post',
  summary: 'A summary',
  content: '# Hello',
  publicationTime: '2025-06-15T14:30:00.000Z',
  _links: {self: {href: '/api/blog-posts/abc-123'}},
};

describe('BlogPostViewer', () => {
  let fixture: ComponentFixture<BlogPostViewer>;
  let router: { navigate: jest.Mock };
  let backend: { deleteBlogPost: jest.Mock };

  const setup = async (resolvedData: object) => {
    router = {navigate: jest.fn()};
    backend = {deleteBlogPost: jest.fn()};

    await TestBed.configureTestingModule({
      imports: [BlogPostViewer, TranslateModule.forRoot(), MarkdownModule.forRoot()],
      providers: [
        {provide: Router, useValue: router},
        {provide: BlogPostsService, useValue: backend},
        {provide: ActivatedRoute, useValue: {snapshot: {data: {blogPost: resolvedData}}}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostViewer);
    fixture.detectChanges();
  };

  const findBlogPostView = () =>
    fixture.debugElement.query(By.directive(BlogPostView));

  const findErrorState = () =>
    fixture.debugElement.query(By.directive(ErrorState));

  describe('resolved data', () => {
    it('should show the blog post view when the blog post loaded successfully', async () => {
      await setup(post);

      expect(findBlogPostView()).toBeTruthy();
      expect(findErrorState()).toBeNull();
    });

    it('should show the error state with the resolved error status when the blog post failed to load', async () => {
      await setup({error: {status: 404}});

      expect(findErrorState()).toBeTruthy();
      expect(findErrorState().componentInstance.status()).toBe(404);
      expect(findBlogPostView()).toBeNull();
    });
  });

  describe('edit', () => {
    it('should navigate to the edit page when edit is clicked', async () => {
      await setup(post);

      findBlogPostView().componentInstance.editClicked.emit('abc-123');

      expect(router.navigate).toHaveBeenCalledWith(['/edit', 'abc-123']);
    });
  });

  describe('delete', () => {
    it('should delete the post and navigate to the list page on success', async () => {
      await setup(post);
      backend.deleteBlogPost.mockReturnValue(of(undefined));

      findBlogPostView().componentInstance.deleteClicked.emit('abc-123');

      expect(backend.deleteBlogPost).toHaveBeenCalledWith('abc-123');
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
