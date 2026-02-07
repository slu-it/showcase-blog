import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, LOCALE_ID} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPostView} from './blog-post-view';
import {BlogPost} from '../blog-posts.model';
import {ConfirmationDialog} from '../../confirmation-dialog/confirmation-dialog';
import {ActionButton} from '../../action-button/action-button';
import {MarkdownModule} from 'ngx-markdown';

@Component({
  template: `
    <app-blog-post-view [post]="post" (editClicked)="onEdit($event)" (deleteClicked)="onDelete($event)"/>`,
  imports: [BlogPostView],
})
class TestHost {
  post: BlogPost = {
    uid: 'abc-123',
    title: 'Test Post',
    summary: 'A summary',
    content: '# Hello',
    publicationTime: '2025-06-15T14:30:00.000Z',
    _links: {self: {href: '/api/blog-posts/abc-123'}},
  };
  onEdit = jest.fn();
  onDelete = jest.fn();
}

describe('BlogPostView', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const getTitle = () =>
    fixture.debugElement.query(By.css('.title')).nativeElement as HTMLElement;

  const getPublicationTime = () =>
    fixture.debugElement.query(By.css('.publicationTime')).nativeElement as HTMLElement;

  const getMarkdownRenderer = () =>
    fixture.debugElement.query(By.css('app-markdown-renderer'));

  const getActionButtons = () =>
    fixture.debugElement.queryAll(By.directive(ActionButton));

  const getEditButton = () =>
    getActionButtons().find(btn => btn.componentInstance.type() === '✏️');

  const getDeleteButton = () =>
    getActionButtons().find(btn => btn.componentInstance.type() === '🗑️');

  const getConfirmationDialog = () =>
    fixture.debugElement.query(By.directive(ConfirmationDialog));

  // Pin the locale to 'en-UK' so the DatePipe "short" format produces
  // consistent output regardless of the machine's locale settings.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, TranslateModule.forRoot(), MarkdownModule.forRoot()],
      providers: [
        {provide: LOCALE_ID, useValue: 'en-UK'},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should display the blog post title', () => {
      expect(getTitle().textContent?.trim()).toBe('Test Post');
    });

    it('should display the formatted publication time', () => {
      expect(getPublicationTime().textContent?.trim()).toBe('6/15/25, 4:30 PM');
    });

    it('should render the markdown content when present', () => {
      expect(getMarkdownRenderer()).toBeTruthy();
    });

    it('should not render the markdown renderer when content is empty', () => {
      host.post = {...host.post, content: ''};
      fixture.detectChanges();

      expect(getMarkdownRenderer()).toBeNull();
    });
  });

  describe('action buttons visibility', () => {
    it('should show the edit button when the post has a patch link', () => {
      host.post = {...host.post, _links: {self: {href: ''}, patch: {href: ''}}};
      fixture.detectChanges();

      expect(getEditButton()).toBeTruthy();
    });

    it('should not show the edit button when the post has no patch link', () => {
      host.post = {...host.post, _links: {self: {href: ''}}};
      fixture.detectChanges();

      expect(getEditButton()).toBeUndefined();
    });

    it('should show the delete button when the post has a delete link', () => {
      host.post = {...host.post, _links: {self: {href: ''}, delete: {href: ''}}};
      fixture.detectChanges();

      expect(getDeleteButton()).toBeTruthy();
    });

    it('should not show the delete button when the post has no delete link', () => {
      host.post = {...host.post, _links: {self: {href: ''}}};
      fixture.detectChanges();

      expect(getDeleteButton()).toBeUndefined();
    });
  });

  describe('edit', () => {
    it('should emit editClicked with the post uid when the edit button is clicked', () => {
      host.post = {...host.post, _links: {self: {href: ''}, patch: {href: ''}}};
      fixture.detectChanges();

      getEditButton()!.componentInstance.clicked.emit();
      fixture.detectChanges();

      expect(host.onEdit).toHaveBeenCalledWith('abc-123');
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      host.post = {...host.post, _links: {self: {href: ''}, delete: {href: ''}}};
      fixture.detectChanges();
    });

    it('should show the confirmation dialog when the delete button is clicked', () => {
      expect(getConfirmationDialog()).toBeNull();

      getDeleteButton()!.componentInstance.clicked.emit();
      fixture.detectChanges();

      expect(getConfirmationDialog()).toBeTruthy();
    });

    it('should emit deleteClicked with the post uid and hide the dialog when deletion is confirmed', () => {
      getDeleteButton()!.componentInstance.clicked.emit();
      fixture.detectChanges();

      getConfirmationDialog().componentInstance.confirmed.emit();
      fixture.detectChanges();

      expect(host.onDelete).toHaveBeenCalledWith('abc-123');
      expect(getConfirmationDialog()).toBeNull();
    });

    it('should hide the confirmation dialog when deletion is cancelled', () => {
      getDeleteButton()!.componentInstance.clicked.emit();
      fixture.detectChanges();

      getConfirmationDialog().componentInstance.cancelled.emit();
      fixture.detectChanges();

      expect(host.onDelete).not.toHaveBeenCalled();
      expect(getConfirmationDialog()).toBeNull();
    });
  });
});
