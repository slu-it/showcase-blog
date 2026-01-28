import {Component, input, OnInit, output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {BlogPostDto} from "../../services/backend.model";

@Component({
  selector: 'app-blog-post-editor-form',
  templateUrl: './blog-post-editor.form.html',
  styleUrl: './blog-post-editor.form.scss',
  imports: [ReactiveFormsModule, TranslateModule],
})
export class BlogPostEditorForm implements OnInit {
  title = input('');
  summary = input('');
  content = input('');
  publicationTime = input(this.toDateTimePickerValueFormat(new Date()));

  submitClicked = output<BlogPostDto>();

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    summary: new FormControl(''),
    content: new FormControl(''),
    publicationTime: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.form.patchValue({
      title: this.title(),
      summary: this.summary(),
      content: this.content(),
      publicationTime: this.publicationTime(),
    });
  }

  setFrom(data: BlogPostDto) {
    this.form.reset({
      title: data.title,
      summary: data.summary ?? '',
      content: data.content ?? '',
      publicationTime: this.toDateTimePickerValueFormat(new Date(data.publicationTime)),
    });
  }

  reset() {
    this.form.reset({
      title: '',
      summary: '',
      content: '',
      publicationTime: this.toDateTimePickerValueFormat(new Date()),
    });
  }

  handleSubmit() {
    this.submitClicked.emit({
      title: this.form.value.title!,
      summary: this.form.value.summary || undefined,
      content: this.form.value.content || undefined,
      publicationTime: this.toUtcIsoString(this.form.value.publicationTime!),
    });
  }

  /**
   * Converts a `datetime-local` value ("YYYY-MM-DDThh:mm") into a UTC ISO-8601
   * string for the backend. Values from a `datetime-local` input represent a
   * local date and time without any timezone offset. When this format is passed
   * to `new Date()`, the JavaScript runtime interprets it as local time; calling
   * `toISOString()` then converts that local instant into its equivalent UTC
   * timestamp, which is what the backend expects.
   */
  private toUtcIsoString(timePickerValue: string): string {
    return new Date(timePickerValue).toISOString();
  }

  /**
   * Formats a Date object into the "YYYY-MM-DDThh:mm" string required by an
   * HTML `datetime-local` input. The `datetime-local` control does not accept
   * ISO-8601 strings (which include seconds, milliseconds, and a "Z" suffix)
   * nor raw Date objects — it requires this exact format. We use local Date
   * accessors (getFullYear, getMonth, etc.) rather than `toISOString()` so
   * that the displayed value reflects the user's local timezone.
   *
   * Used both for setting the initial default (current time) and for
   * converting backend UTC timestamps back into the form's local time format
   * via `new Date(utcString)`, which the runtime resolves to local time.
   */
  private toDateTimePickerValueFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  isRequired(control: AbstractControl): boolean {
    return control.hasValidator(Validators.required);
  }
}
