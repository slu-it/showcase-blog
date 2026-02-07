import {AfterViewInit, Component, ElementRef, input, output, viewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {BlogPostDto} from "../blog-posts.model";
import {toDateTimePickerValueFormat, toUtcIsoString} from '../../time.functions';
import {MarkdownRenderer} from '../../markdown-renderer/markdown-renderer';

@Component({
  selector: 'app-blog-post-editor-form',
  templateUrl: './blog-post-editor-form.html',
  styleUrl: './blog-post-editor-form.scss',
  imports: [ReactiveFormsModule, TranslateModule, MarkdownRenderer],
})
export class BlogPostEditorForm implements AfterViewInit {
  readonly submitLabel = input.required<string>();
  readonly cancelClicked = output<void>();
  readonly submitClicked = output<BlogPostDto>();

  private titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');
  private referenceValues?: Record<string, string>; // TODO is this the best way?

  readonly form = new FormGroup({
    title: new FormControl('', Validators.required),
    summary: new FormControl(''),
    content: new FormControl(''),
    publicationTime: new FormControl(toDateTimePickerValueFormat(new Date()), Validators.required),
  });
  protected contentTab: 'write' | 'preview' = 'write';

  ngAfterViewInit(): void {
    this.titleInput().nativeElement.focus();
  }

  setFrom(data: BlogPostDto) {
    const values = {
      title: data.title,
      summary: data.summary ?? '',
      content: data.content ?? '',
      publicationTime: toDateTimePickerValueFormat(new Date(data.publicationTime)),
    };
    this.form.reset(values);
    this.referenceValues = values;
  }

  get formCanBeSubmitted(): boolean {
    if (!this.form.valid) return false;
    if (!this.referenceValues) return true;
    const current = this.form.value;
    return Object.keys(this.referenceValues).some(
      key => (current[key as keyof typeof current] ?? '') !== this.referenceValues![key]
    );
  }

  handleCancelClicked() {
    this.cancelClicked.emit();
  }

  handleSubmit() {
    this.submitClicked.emit({
      title: this.form.value.title!,
      summary: this.form.value.summary ?? undefined,
      content: this.form.value.content ?? undefined,
      publicationTime: toUtcIsoString(this.form.value.publicationTime!),
    });
  }

  isRequired(control: AbstractControl): boolean {
    return control.hasValidator(Validators.required);
  }
}
