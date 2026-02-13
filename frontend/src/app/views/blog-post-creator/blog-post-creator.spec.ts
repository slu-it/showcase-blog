import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPostCreator} from './blog-post-creator';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {ContextService} from '../../common/context/context.service';
import {BlogPostEditorForm} from '../../common/blog-posts/editor/blog-post-editor-form';
import {ErrorState} from '../../common/error-state/error-state';
import {BlogPost, BlogPostDto} from '../../common/blog-posts/blog-posts.model';

describe('BlogPostCreator', () => {
  let fixture: ComponentFixture<BlogPostCreator>;
  let router: {navigate: jest.Mock};
  let backend: {createBlogPost: jest.Mock};

  const setupWithUser = async (isAuthor: boolean) => {
    router = {navigate: jest.fn()};
    backend = {createBlogPost: jest.fn()};

    await TestBed.configureTestingModule({
      imports: [BlogPostCreator, TranslateModule.forRoot()],
      providers: [
        {provide: Router, useValue: router},
        {provide: BlogPostsService, useValue: backend},
        {provide: ContextService, useValue: {user: () => ({username: 'alice', isAuthor, isAdmin: false})}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostCreator);
    fixture.detectChanges();
  };

  const findEditorForm = () =>
    fixture.debugElement.query(By.directive(BlogPostEditorForm));

  const findErrorState = () =>
    fixture.debugElement.query(By.directive(ErrorState));

  describe('authorization', () => {
    it('should show the editor form when the user is an author', async () => {
      await setupWithUser(true);

      expect(findEditorForm()).toBeTruthy();
      expect(findErrorState()).toBeNull();
    });

    it('should show the 403 error state when the user is not an author', async () => {
      await setupWithUser(false);

      expect(findErrorState()).toBeTruthy();
      expect(findErrorState().componentInstance.status()).toBe(403);
      expect(findEditorForm()).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should navigate to / when cancel is clicked', async () => {
      await setupWithUser(true);

      findEditorForm().componentInstance.cancelClicked.emit();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('submit', () => {
    it('should create the blog post and navigate to the view page on success', async () => {
      await setupWithUser(true);

      const dto: BlogPostDto = {title: 'New Post', publicationTime: '2025-06-15T14:30:00.000Z'};
      const created: BlogPost = {
        uid: 'new-123', title: 'New Post', summary: '', content: '',
        publicationTime: '2025-06-15T14:30:00.000Z',
        _links: {self: {href: ''}},
      };
      backend.createBlogPost.mockReturnValue(of(created));

      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.createBlogPost).toHaveBeenCalledWith(dto);
      expect(router.navigate).toHaveBeenCalledWith(['/view', 'new-123']);
    });

    it('should not break when the service returns an error', async () => {
      await setupWithUser(true);

      const dto: BlogPostDto = {title: 'New Post', publicationTime: '2025-06-15T14:30:00.000Z'};
      backend.createBlogPost.mockReturnValue(throwError(() => ({status: 500})));

      findEditorForm().componentInstance.submitClicked.emit(dto);

      expect(backend.createBlogPost).toHaveBeenCalledWith(dto);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
