import {Location} from '@angular/common';
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
import {currentLocationWasReachedNavigatingTheApplication} from '../../common/navigation.functions';

@Component({
  selector: 'app-v-blog-post-editor',
  templateUrl: './blog-post-editor.html',
  styleUrl: './blog-post-editor.scss',
  imports: [BlogPostEditorForm, ErrorState, TranslateModule],
})
export class BlogPostEditor implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly context = inject(ContextService);
  private readonly service = inject(BlogPostsService);
  private readonly location = inject(Location);
  private readonly editor = viewChild(BlogPostEditorForm);

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

  get userCanGenerallyEditBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }

  get blogPostWasLoadedSuccessfully(): boolean {
    return this.originalData != null;
  }

  async handleCancel() {
    if (currentLocationWasReachedNavigatingTheApplication(this.location)) {
      this.location.back();
    } else {
      await this.router.navigate(['/view', this.originalData!.uid]);
    }
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

    this.service.updateBlogPost(this.originalData!.uid, update)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => this.router.navigate(['/view', response.uid]));
  }
}
