import {Component, input, OnInit, output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {BlogPostDto} from "../../services/backend.model";

@Component({
  selector: 'app-blog-post-editor',
  templateUrl: './blog-post-editor.html',
  styleUrl: './blog-post-editor.scss',
  imports: [ReactiveFormsModule, TranslateModule],
})
export class BlogPostEditor implements OnInit {
  title = input('');
  summary = input('');
  content = input('');
  publicationTime = input(this.getCurrentDateTime());

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

  handleSubmit() {
    this.submitClicked.emit({
      title: this.form.value.title!,
      summary: this.form.value.summary || undefined,
      content: this.form.value.content || undefined,
      publicationTime: this.toUtcIsoString(this.form.value.publicationTime!),
    });
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private toUtcIsoString(localDateTime: string): string {
    return new Date(localDateTime).toISOString();
  }

  isRequired(control: AbstractControl): boolean {
    return control.hasValidator(Validators.required);
  }
}
