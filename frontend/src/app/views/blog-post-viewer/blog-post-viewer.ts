import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPost} from '../../common/blog-posts/blog-posts.model';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {ErrorState} from '../../common/error-state/error-state';
import {BlogPostView} from '../../common/blog-posts/view/blog-post-view';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-v-blog-post-viewer',
  templateUrl: './blog-post-viewer.html',
  styleUrl: './blog-post-viewer.scss',
  imports: [ErrorState, TranslateModule, BlogPostView],
})
export class BlogPostViewer implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private backend = inject(BlogPostsService);

  protected post?: BlogPost;
  protected errorStatus?: number;

  ngOnInit() {
    const resolved = this.route.snapshot.data['blogPost'];
    if (resolved.error) {
      this.errorStatus = resolved.error.status;
    } else {
      this.post = resolved;
    }
  }

  loadedSuccessfully(): boolean {
    return this.post != null;
  }

  async editPost(uid: string) {
    await this.router.navigate(['/edit', uid]);
  }

  async deletePost(uid: string) {
    this.backend.deleteBlogPost(uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          /* already handled by backend service */
        },
      });
  }
}
