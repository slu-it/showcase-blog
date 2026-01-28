import {Component, DestroyRef, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {BackendService} from '../../services/backend.service';
import {BlogPostDto} from '../../services/backend.model';
import {BlogPostEditorForm} from '../../common/blog-post-editor-form/blog-post-editor.form';

@Component({
  selector: 'app-blog-post-creator-view',
  templateUrl: './blog-post-creator.view.html',
  styleUrl: './blog-post-creator.view.scss',
  imports: [BlogPostEditorForm, TranslateModule],
})
export class BlogPostCreatorView {
  private destroyRef = inject(DestroyRef);
  private service = inject(BackendService);
  private translate = inject(TranslateService);

  private editor = viewChild.required(BlogPostEditorForm);

  message = '-';

  handleSubmit(data: BlogPostDto) {
    this.message = this.translate.instant('creator.creating');
    this.service.create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.message = this.translate.instant('creator.success');
          this.editor().reset();
        },
        error: () => this.message = this.translate.instant('creator.error')
      });
  }
}
