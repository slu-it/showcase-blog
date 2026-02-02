import {AfterViewInit, Component, DestroyRef, inject, OnInit, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPost, BlogPostDto, BlogPostUpdateDto} from '../../common/blog-posts/blog-posts.model';
import {BlogPostsService} from '../../common/blog-posts/blog-posts.service';
import {BlogPostEditorForm} from '../../common/blog-posts/editor/blog-post-editor-form';
import {ErrorState} from '../../common/error-state/error-state';
import {truncateIsoStringToMinutes} from '../../common/time.functions';
import {ContextService} from '../../common/context/context.service';

@Component({
  selector: 'app-v-blog-post-editor',
  templateUrl: './blog-post-editor.html',
  styleUrl: './blog-post-editor.scss',
  imports: [BlogPostEditorForm, ErrorState, TranslateModule],
})
export class BlogPostEditor implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private context = inject(ContextService);
  private backend = inject(BlogPostsService);
  private editor = viewChild(BlogPostEditorForm);

  private originalData?: BlogPost;
  protected errorStatus?: number;

  ngOnInit() {
    const resolved = this.route.snapshot.data['blogPost'];
    if (resolved.error) {
      this.errorStatus = resolved.error.status;
    } else {
      this.originalData = resolved;
    }
  }

  ngAfterViewInit() {
    if (this.originalData) {
      this.editor()!.setFrom(this.originalData);
    }
  }

  canGenerallyEditBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }

  loadedSuccessfully(): boolean {
    return this.originalData != null;
  }

  async handleSubmit(data: BlogPostDto) {
    const original = this.originalData!;
    const update: BlogPostUpdateDto = {};

    if (data.title !== original.title) {
      update.title = data.title;
    }
    if ((data.summary ?? '') !== (original.summary ?? '')) {
      update.summary = data.summary ?? null;
    }
    if ((data.content ?? '') !== (original.content ?? '')) {
      update.content = data.content ?? null;
    }
    if (data.publicationTime !== truncateIsoStringToMinutes(original.publicationTime)) {
      update.publicationTime = data.publicationTime;
    }

    if (Object.keys(update).length === 0) return;

    this.backend.updateBlogPost(this.originalData!.uid, update)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.router.navigate(['/view', response.uid]),
        error: () => {
          /* already handled by backend service */
        },
      });
  }
}
