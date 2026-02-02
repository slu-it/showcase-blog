import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {BlogPost, BlogPostsPage, PageInfo} from '../../common/blog-posts/blog-posts.model';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {Router} from '@angular/router';
import {BlogPostPreview} from '../../common/blog-posts/preview/blog-post-preview';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Pagination} from './pagination/pagination';

const dummyPageInfo = {number: 1, size: 5, totalPages: 1, totalElements: 0};

@Component({
  selector: 'app-v-blog-post-list',
  templateUrl: './blog-post-list.html',
  styleUrl: './blog-post-list.scss',
  imports: [BlogPostPreview, Pagination]
})
export class BlogPostList implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly backend = inject(BlogPostsService);
  private readonly router = inject(Router);

  private readonly _blogPosts = signal<BlogPost[]>([]);
  protected readonly blogPosts = this._blogPosts.asReadonly();

  private readonly _pageInfo = signal<PageInfo>(dummyPageInfo);
  protected readonly pageInfo = this._pageInfo.asReadonly();

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(pageNumber: number): void {
    this.backend.getBlogPostsPage(pageNumber, this.pageInfo().size)
      .subscribe(page => this.setCurrentPage(page));
  }

  private setCurrentPage(page: BlogPostsPage) {
    this._pageInfo.update(() => page.page);
    this._blogPosts.update(() => page._embedded?.blogPosts ?? []);
  }

  async editPost(uid: string) {
    await this.router.navigate(['/edit', uid]);
  }

  deletePost(uid: string) {
    this.backend.deleteBlogPost(uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadPage(this.pageInfo().number),
        error: () => {
          /* already handled by backend service */
        },
      });
  }
}
