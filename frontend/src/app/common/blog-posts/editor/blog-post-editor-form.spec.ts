import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPostEditorForm} from './blog-post-editor-form';
import {BlogPostDto} from '../blog-posts.model';
import {MarkdownModule} from 'ngx-markdown';

@Component({
  template: `
    <app-blog-post-editor-form [submitLabel]="submitLabel" (cancelClicked)="onCancel()"
                               (submitClicked)="onSubmit($event)"/>`,
  imports: [BlogPostEditorForm],
})
class TestHost {
  submitLabel = 'editor.create';
  onCancel = jest.fn();
  onSubmit = jest.fn();
}

describe('BlogPostEditorForm', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let component: BlogPostEditorForm;

  const getTitleInput = () =>
    fixture.debugElement.query(By.css('#title')).nativeElement as HTMLInputElement;
  const getSummaryTextarea = () =>
    fixture.debugElement.query(By.css('#summary')).nativeElement as HTMLTextAreaElement;
  const getContentTextarea = () =>
    findContentTextarea().nativeElement as HTMLTextAreaElement;

  const getButton = (cssClass: string) =>
    fixture.debugElement.query(By.css(`.${cssClass}`)).nativeElement as HTMLButtonElement;
  const getSubmitButton = () => getButton('submit');
  const getCancelButton = () => getButton('cancel');

  const getTabButtons = () =>
    fixture.debugElement.queryAll(By.css('.tab'));
  const getWriteTab = () => getTabButtons()[0].nativeElement as HTMLButtonElement;
  const getPreviewTab = () => getTabButtons()[1].nativeElement as HTMLButtonElement;

  const findContentTextarea = () =>
    fixture.debugElement.query(By.css('#content'));
  const findMarkdownPreview = () =>
    fixture.debugElement.query(By.css('app-markdown-renderer'));

  const getRequiredMarkers = (fieldId: string) => {
    const field = fixture.debugElement.query(By.css(`label[for="${fieldId}"]`));
    return field.query(By.css('.required-marker'));
  };

  const fillForm = (values: { title?: string; summary?: string; content?: string; publicationTime?: string }) => {
    if (values.title != null) component.form.controls.title.setValue(values.title);
    if (values.summary != null) component.form.controls.summary.setValue(values.summary);
    if (values.content != null) component.form.controls.content.setValue(values.content);
    if (values.publicationTime != null) component.form.controls.publicationTime.setValue(values.publicationTime);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, TranslateModule.forRoot(), MarkdownModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(BlogPostEditorForm)).componentInstance;
    fixture.detectChanges();
  });

  describe('focus', () => {
    it('should focus the title input on init', () => {
      expect(document.activeElement).toBe(getTitleInput());
    });
  });

  describe('formCanBeSubmitted', () => {
    it('should disable submit when the title is empty', () => {
      fillForm({title: ''});

      expect(getSubmitButton().disabled).toBe(true);
    });

    it('should enable submit when the form is valid and has no reference values', () => {
      fillForm({title: 'A title'});

      expect(getSubmitButton().disabled).toBe(false);
    });

    it('should disable submit when the form values match the reference values', () => {
      const dto: BlogPostDto = {
        title: 'A title',
        summary: 'sum',
        content: 'cnt',
        publicationTime: '2025-06-15T14:30:00.000Z'
      };
      component.setFrom(dto);
      fixture.detectChanges();

      expect(getSubmitButton().disabled).toBe(true);
    });

    it('should enable submit when the form values differ from the reference values', () => {
      const dto: BlogPostDto = {
        title: 'A title',
        summary: 'sum',
        content: 'cnt',
        publicationTime: '2025-06-15T14:30:00.000Z'
      };
      component.setFrom(dto);
      fillForm({title: 'Changed title'});

      expect(getSubmitButton().disabled).toBe(false);
    });
  });

  describe('content tabs', () => {
    it('should show the write tab by default', () => {
      expect(findContentTextarea()).toBeTruthy();
      expect(findMarkdownPreview()).toBeNull();
    });

    it('should show the markdown preview when the preview tab is clicked', () => {
      getPreviewTab().click();
      fixture.detectChanges();

      expect(findContentTextarea()).toBeNull();
      expect(findMarkdownPreview()).toBeTruthy();
    });

    it('should show the textarea when the write tab is clicked', () => {
      getPreviewTab().click();
      fixture.detectChanges();

      getWriteTab().click();
      fixture.detectChanges();

      expect(findContentTextarea()).toBeTruthy();
      expect(findMarkdownPreview()).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should emit cancelClicked when the cancel button is clicked', () => {
      getCancelButton().click();

      expect(host.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('submit', () => {
    it('should emit submitClicked with the form data when submitted', () => {
      fillForm({title: 'My Post', summary: 'A summary', content: '# Hello', publicationTime: '2025-06-15T14:30'});

      getSubmitButton().click();
      fixture.detectChanges();

      expect(host.onSubmit).toHaveBeenCalledWith({
        title: 'My Post',
        summary: 'A summary',
        content: '# Hello',
        publicationTime: new Date('2025-06-15T14:30').toISOString(),
      });
    });
  });

  describe('setFrom', () => {
    it('should populate the form fields from a BlogPostDto', () => {
      const dto: BlogPostDto = {
        title: 'A title',
        summary: 'sum',
        content: 'cnt',
        publicationTime: '2025-06-15T14:30:00.000Z'
      };
      component.setFrom(dto);
      fixture.detectChanges();

      expect(getTitleInput().value).toBe('A title');
      expect(getSummaryTextarea().value).toBe('sum');
      expect(getContentTextarea().value).toBe('cnt');
    });
  });

  describe('required markers', () => {
    it('should show the required marker for title and publicationTime', () => {
      expect(getRequiredMarkers('title')).toBeTruthy();
      expect(getRequiredMarkers('publicationTime')).toBeTruthy();
    });

    it('should not show the required marker for summary and content', () => {
      expect(getRequiredMarkers('summary')).toBeNull();
      expect(getRequiredMarkers('content')).toBeNull();
    });
  });
});
