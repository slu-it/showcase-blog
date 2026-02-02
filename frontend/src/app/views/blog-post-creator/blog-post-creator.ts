import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {BlogPostDto} from '../../common/blog-posts/blog-posts.model';
import {BlogPostEditorForm} from '../../common/blog-posts/editor/blog-post-editor-form';
import {Router} from '@angular/router';
import {ErrorState} from '../../common/error-state/error-state';
import {ContextService} from '../../common/context/context.service';

@Component({
  selector: 'app-v-blog-post-creator',
  templateUrl: './blog-post-creator.html',
  styleUrl: './blog-post-creator.scss',
  imports: [BlogPostEditorForm, ErrorState],
})
export class BlogPostCreator {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private context = inject(ContextService);
  private backend = inject(BlogPostsService);

  canCreateBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }

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
}
