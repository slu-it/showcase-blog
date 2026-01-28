import {AfterViewInit, Component, DestroyRef, inject, OnInit, viewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule} from '@ngx-translate/core';
import {BlogPost, BlogPostDto, BlogPostUpdateDto} from '../../services/backend.model';
import {BackendService} from '../../services/backend.service';
import {BlogPostEditorForm} from '../../common/blog-post-editor-form/blog-post-editor.form';
import {ErrorMessage} from '../../common/error-messages/error.message';

@Component({
  selector: 'app-blog-post-editor-view',
  templateUrl: './blog-post-editor.view.html',
  styleUrl: './blog-post-editor.view.scss',
  imports: [BlogPostEditorForm, ErrorMessage, TranslateModule],
})
export class BlogPostEditorView implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private service = inject(BackendService);
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

  handleSubmit(data: BlogPostDto) {
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
    if (data.publicationTime !== this.truncateToMinutes(original.publicationTime)) {
      update.publicationTime = data.publicationTime;
    }

    if (Object.keys(update).length === 0) return;

    this.service.update(this.originalData!.uid, update)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.originalData = response;
        this.editor()!.setFrom(response);
      });
  }

  /**
   * The datetime-local input only has minute precision, so the round-trip
   * (backend UTC ISO → local datetime → UTC ISO) loses seconds and milliseconds.
   * To avoid false positives when comparing the submitted value against the
   * original, we truncate the original to minute precision as well.
   */
  private truncateToMinutes(isoString: string): string {
    const date = new Date(isoString);
    date.setSeconds(0, 0);
    return date.toISOString();
  }
}
