import {Component, input, output} from '@angular/core';
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
export class BlogPostEditorForm {
  readonly submitLabel = input.required<string>();
  readonly submitClicked = output<BlogPostDto>();

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    summary: new FormControl(''),
    content: new FormControl(''),
    publicationTime: new FormControl(toDateTimePickerValueFormat(new Date()), Validators.required),
  });

  contentTab: 'write' | 'preview' = 'write';

  private referenceValues?: Record<string, string>; // TODO is this the best way?

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

  canBeSubmitted(): boolean {
    if (!this.form.valid) return false;
    if (!this.referenceValues) return true;
    const current = this.form.value;
    return Object.keys(this.referenceValues).some(
      key => (current[key as keyof typeof current] ?? '') !== this.referenceValues![key]
    );
  }

  handleSubmit() {
    this.submitClicked.emit({
      title: this.form.value.title!,
      summary: this.form.value.summary || undefined,
      content: this.form.value.content || undefined,
      publicationTime: toUtcIsoString(this.form.value.publicationTime!),
    });
  }

  isRequired(control: AbstractControl): boolean {
    return control.hasValidator(Validators.required);
  }
}
