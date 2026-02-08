import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {BlogPostDto} from '../../common/blog-posts/blog-posts.model';
import {BlogPostEditorForm} from '../../common/blog-posts/editor/blog-post-editor-form';
import {Router} from '@angular/router';
import {ErrorState} from '../../common/error-state/error-state';
import {ContextService} from '../../common/context/context.service';
import {currentLocationWasReachedNavigatingTheApplication} from '../../common/navigation.functions';
import {Location} from '@angular/common';

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
  private service = inject(BlogPostsService);
  private location = inject(Location);

  get userCanCreateBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }

  async handleCancel() {
    if (currentLocationWasReachedNavigatingTheApplication(this.location)) {
      this.location.back();
    } else {
      await this.router.navigate(['/']);
    }
  }

  async handleSubmit(data: BlogPostDto) {
    this.service.createBlogPost(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => this.router.navigate(['/view', response.uid]));
  }
}
