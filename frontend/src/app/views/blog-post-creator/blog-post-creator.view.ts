import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BackendService} from '../../services/backend/backend.service';
import {BlogPostDto} from '../../services/backend/backend.model';
import {BlogPostEditorForm} from '../../common/components/blog-post-editor/blog-post-editor-form';
import {Router} from '@angular/router';
import {ErrorMessage} from '../../common/components/error-message/error.message';
import {ContextService} from '../../services/context/context.service';

@Component({
  selector: 'app-blog-post-creator-view',
  templateUrl: './blog-post-creator.view.html',
  styleUrl: './blog-post-creator.view.scss',
  imports: [BlogPostEditorForm, ErrorMessage],
})
export class BlogPostCreatorView {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private context = inject(ContextService);
  private backend = inject(BackendService);

  async handleSubmit(data: BlogPostDto) {
    this.backend.createBlogPost(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.router.navigate(['/view', response.uid]),
        error: () => {
          /* already handled by backend service */
        },
      });
  }

  canCreateBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }
}
