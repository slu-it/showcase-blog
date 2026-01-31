import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPost} from '../../services/backend/backend.model';
import {BackendService} from '../../services/backend/backend.service';
import {ErrorMessage} from '../../common/components/error-message/error.message';
import {BlogPostView} from '../../common/components/blog-post-view/blog-post-view';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-blog-post-viewer-view',
  templateUrl: './blog-post-viewer.view.html',
  styleUrl: './blog-post-viewer.view.scss',
  imports: [ErrorMessage, TranslateModule, BlogPostView],
})
export class BlogPostViewerView implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private backend = inject(BackendService);

  post?: BlogPost;
  errorStatus?: number;

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
