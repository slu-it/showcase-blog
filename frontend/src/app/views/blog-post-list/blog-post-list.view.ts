import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {BlogPost} from '../../services/backend/backend.model';
import {BackendService} from '../../services/backend/backend.service';
import {Router} from '@angular/router';
import {BlogPostPreview} from '../../common/components/blog-post-preview/blog-post-preview';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-blog-post-list-view',
  templateUrl: './blog-post-list.view.html',
  styleUrl: './blog-post-list.view.scss',
  imports: [BlogPostPreview]
})
export class BlogPostListView implements OnInit {
  private destroyRef = inject(DestroyRef);
  private backend = inject(BackendService);
  private router = inject(Router);
  blogPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.loadPosts();
  }

  async editPost(uid: string) {
    await this.router.navigate(['/edit', uid]);
  }

  deletePost(uid: string) {
    this.backend.deleteBlogPost(uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadPosts(),
        error: () => {
          /* already handled by backend service */
        },
      });
  }

  private loadPosts(): void {
    this.backend.getBlogPostsPage(1, 10)
      .subscribe(page => {
        this.blogPosts = page._embedded?.blogPosts ?? [];
      });
  }
}
