import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {BlogPost, BlogPostsPage, PageInfo} from '../../common/blog-posts/blog-posts.model';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogPostPreview} from '../../common/blog-posts/preview/blog-post-preview';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Pagination} from './pagination/pagination';
import {TestDataGenerator} from '../../common/test-data-generator/test-data-generator';
import {ContextService} from '../../common/context/context.service';
import {TranslatePipe} from '@ngx-translate/core';

const dummyPageInfo = {number: 1, size: 10, totalPages: 1, totalElements: 0};

@Component({
  selector: 'app-v-blog-post-list',
  templateUrl: './blog-post-list.html',
  styleUrl: './blog-post-list.scss',
  imports: [BlogPostPreview, Pagination, TestDataGenerator, TranslatePipe]
})
export class BlogPostList implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly context = inject(ContextService);
  private readonly service = inject(BlogPostsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _blogPosts = signal<BlogPost[]>([]);
  protected readonly blogPosts = this._blogPosts.asReadonly();

  private readonly _pageInfo = signal<PageInfo>(dummyPageInfo);
  protected readonly pageInfo = this._pageInfo.asReadonly();

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const pageNumber = Number(params.get('pageNumber')) || 1;
        const pageSize = Number(params.get('pageSize')) || 10;
        this.loadPage(pageNumber, pageSize);
      });
  }

  get thereAreBlogPosts(): boolean {
    return this.blogPosts().length > 0;
  }

  get userCanGenerateBlogPosts(): boolean {
    return this.context.user().isAdmin;
  }

  private setCurrentPage(page: BlogPostsPage) {
    this._pageInfo.update(() => page.page);
    this._blogPosts.update(() => page._embedded?.blogPosts ?? []);
  }

  async switchPage(pageNumber: number) {
    const extras = {queryParams: {pageNumber: pageNumber, pageSize: this.pageInfo().size}};
    await this.router.navigate([''], extras);
  }

  async editPost(uid: string) {
    await this.router.navigate(['/edit', uid]);
  }

  deletePost(uid: string) {
    this.service.deleteBlogPost(uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reloadPage());
  }

  reloadPage() {
    this.loadPage(this.pageInfo().number);
  }

  private loadPage(pageNumber: number, pageSize: number = this.pageInfo().size) {
    this.service.getBlogPostsPage(pageNumber, pageSize)
      .subscribe(page => this.setCurrentPage(page));
  }
}
