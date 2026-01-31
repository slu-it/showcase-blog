import {AfterViewInit, Component, DestroyRef, inject, OnInit, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPost, BlogPostDto, BlogPostUpdateDto} from '../../services/backend/backend.model';
import {BackendService} from '../../services/backend/backend.service';
import {BlogPostEditorForm} from '../../common/components/blog-post-editor/blog-post-editor-form';
import {ErrorMessage} from '../../common/components/error-message/error.message';
import {truncateIsoStringToMinutes} from '../../common/time.functions';
import {ContextService} from '../../services/context/context.service';

@Component({
  selector: 'app-blog-post-editor-view',
  templateUrl: './blog-post-editor.view.html',
  styleUrl: './blog-post-editor.view.scss',
  imports: [BlogPostEditorForm, ErrorMessage, TranslateModule],
})
export class BlogPostEditorView implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private context = inject(ContextService);
  private backend = inject(BackendService);
  private editor = viewChild(BlogPostEditorForm);

  private originalData?: BlogPost;
  errorStatus?: number;

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

  canGenerallyEditBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }
}
