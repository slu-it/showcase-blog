import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {BackendService} from '../../services/backend.service';
import {BlogPostDto} from '../../services/backend.model';
import {BlogPostEditor} from '../../common/blog-post-editor/blog-post-editor';

@Component({
  selector: 'app-blog-post-creator',
  templateUrl: './blog-post-creator.html',
  styleUrl: './blog-post-creator.scss',
  imports: [BlogPostEditor, TranslateModule],
})
export class BlogPostCreator {
  private destroyRef = inject(DestroyRef);
  private service = inject(BackendService);
  private translate = inject(TranslateService);

  message = '-';

  handleSubmit(data: BlogPostDto) {
    this.message = this.translate.instant('creator.creating');
    this.service.create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.message = this.translate.instant('creator.success'),
        error: () => this.message = this.translate.instant('creator.error')
      });
  }
}
