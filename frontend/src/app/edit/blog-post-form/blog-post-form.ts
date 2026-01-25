import {Component, DestroyRef, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BlogPostFormService} from './blog-post-form.service';

@Component({
  selector: 'app-blog-post-creator',
  templateUrl: './blog-post-form.html',
  styleUrl: './blog-post-form.scss',
  imports: [ReactiveFormsModule],
})
export class BlogPostForm {
  private destroyRef = inject(DestroyRef);
  private service = inject(BlogPostFormService);

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    summary: new FormControl('', Validators.required),
  });
  message = '-';

  handleSubmit() {
    this.message = 'creating ...';
    let data = {
      title: this.form.value.title ?? '',
      summary: this.form.value.summary ?? '',
    };
    this.service.create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.message = 'Successfully Created!',
        error: () => this.message = 'Error'
      });
  }
}
