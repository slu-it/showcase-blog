import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPostEditor} from './blog-post-editor';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {ContextService} from '../../common/context/context.service';
import {BlogPostEditorForm} from '../../common/blog-posts/editor/blog-post-editor-form';
import {ErrorState} from '../../common/error-state/error-state';
import {BlogPost, BlogPostDto} from '../../common/blog-posts/blog-posts.model';

const originalPost: BlogPost = {
  uid: 'abc-123',
  title: 'Original Title',
  summary: 'Original summary',
  content: 'Original content',
  publicationTime: '2025-06-15T14:30:00.000Z',
  _links: {self: {href: ''}},
};

describe('BlogPostEditor', () => {
  let fixture: ComponentFixture<BlogPostEditor>;
  let router: { navigate: jest.Mock };
  let backend: { updateBlogPost: jest.Mock };

  const setup = async (options: { isAuthor: boolean; resolvedData: object }) => {
    router = {navigate: jest.fn()};
    backend = {updateBlogPost: jest.fn()};

    await TestBed.configureTestingModule({
      imports: [BlogPostEditor, TranslateModule.forRoot()],
      providers: [
        {provide: Router, useValue: router},
        {provide: BlogPostsService, useValue: backend},
        {provide: ContextService, useValue: {user: () => ({username: 'alice', isAuthor: options.isAuthor, isAdmin: false})}},
        {provide: ActivatedRoute, useValue: {snapshot: {data: {blogPost: options.resolvedData}}}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostEditor);
    fixture.detectChanges();
  };

  const findEditorForm = () =>
    fixture.debugElement.query(By.directive(BlogPostEditorForm));

  const findErrorState = () =>
    fixture.debugElement.query(By.directive(ErrorState));

  describe('authorization', () => {
    it('should show the 403 error state when the user is not an author', async () => {
      // Pass error-resolved data to avoid triggering ngAfterViewInit's setFrom
      // on a non-existent editor — the 403 is based on the user role, not the resolved data.
      await setup({isAuthor: false, resolvedData: {error: {status: 404}}});

      expect(findErrorState()).toBeTruthy();
      expect(findErrorState().componentInstance.status()).toBe(403);
      expect(findEditorForm()).toBeNull();
    });
  });

  describe('resolved data', () => {
    it('should show the error state with the resolved error status when the blog post failed to load', async () => {
      await setup({isAuthor: true, resolvedData: {error: {status: 404}}});

      expect(findErrorState()).toBeTruthy();
      expect(findErrorState().componentInstance.status()).toBe(404);
      expect(findEditorForm()).toBeNull();
    });

    it('should show the editor form when the user is an author and the blog post loaded successfully', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});

      expect(findEditorForm()).toBeTruthy();
      expect(findErrorState()).toBeNull();
    });

    it('should populate the editor form with the blog post data', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});

      const form = findEditorForm().componentInstance as BlogPostEditorForm;
      expect(form.form.value.title).toBe('Original Title');
      expect(form.form.value.summary).toBe('Original summary');
      expect(form.form.value.content).toBe('Original content');
    });
  });

  describe('cancel', () => {
    it('should navigate to the view page when cancel is clicked', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});

      findEditorForm().componentInstance.cancelClicked.emit();

      expect(router.navigate).toHaveBeenCalledWith(['/view', 'abc-123']);
    });
  });

  describe('submit', () => {
    it('should send only changed fields and navigate to the view page on success', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});

      const updated: BlogPost = {...originalPost, title: 'Updated Title'};
      backend.updateBlogPost.mockReturnValue(of(updated));

      const dto: BlogPostDto = {
        title: 'Updated Title',
        summary: 'Original summary',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {title: 'Updated Title'});
      expect(router.navigate).toHaveBeenCalledWith(['/view', 'abc-123']);
    });

    it('should include only the summary when only summary changed', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(of(originalPost));

      const dto: BlogPostDto = {
        title: 'Original Title',
        summary: 'Updated summary',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {summary: 'Updated summary'});
    });

    it('should include only the content when only content changed', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(of(originalPost));

      const dto: BlogPostDto = {
        title: 'Original Title',
        summary: 'Original summary',
        content: 'Updated content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {content: 'Updated content'});
    });

    it('should include only the publicationTime when only publicationTime changed', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(of(originalPost));

      const dto: BlogPostDto = {
        title: 'Original Title',
        summary: 'Original summary',
        content: 'Original content',
        publicationTime: '2025-07-01T10:00:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {publicationTime: '2025-07-01T10:00:00.000Z'});
    });

    it('should include all changed fields when multiple fields changed', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(of(originalPost));

      const dto: BlogPostDto = {
        title: 'New Title',
        summary: 'New summary',
        content: 'Original content',
        publicationTime: '2025-07-01T10:00:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {
        title: 'New Title',
        summary: 'New summary',
        publicationTime: '2025-07-01T10:00:00.000Z',
      });
    });

    it('should send null for summary when it is cleared', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(of(originalPost));

      const dto: BlogPostDto = {
        title: 'Original Title',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {summary: null});
    });

    it('should send null for content when it is cleared', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(of(originalPost));

      const dto: BlogPostDto = {
        title: 'Original Title',
        summary: 'Original summary',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {content: null});
    });

    it('should not break when the service returns an error', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});
      backend.updateBlogPost.mockReturnValue(throwError(() => ({status: 500})));

      const dto: BlogPostDto = {
        title: 'Updated Title',
        summary: 'Original summary',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).toHaveBeenCalledWith('abc-123', {title: 'Updated Title'});
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not detect a change when both original and submitted summary are empty', async () => {
      const postWithEmptySummary: BlogPost = {...originalPost, summary: ''};
      await setup({isAuthor: true, resolvedData: postWithEmptySummary});

      const dto: BlogPostDto = {
        title: 'Original Title',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).not.toHaveBeenCalled();
    });

    it('should ignore seconds in the original publicationTime when comparing', async () => {
      const postWithSeconds: BlogPost = {...originalPost, publicationTime: '2025-06-15T14:30:42.000Z'};
      await setup({isAuthor: true, resolvedData: postWithSeconds});

      const dto: BlogPostDto = {
        title: 'Original Title',
        summary: 'Original summary',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).not.toHaveBeenCalled();
    });

    it('should not call the backend when no fields have changed', async () => {
      await setup({isAuthor: true, resolvedData: originalPost});

      const dto: BlogPostDto = {
        title: 'Original Title',
        summary: 'Original summary',
        content: 'Original content',
        publicationTime: '2025-06-15T14:30:00.000Z',
      };
      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.updateBlogPost).not.toHaveBeenCalled();
    });
  });
});
