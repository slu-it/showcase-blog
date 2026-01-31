import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {BlogPost, BlogPostDto, BlogPostsPage, BlogPostUpdateDto, Context} from './backend.model';
import {NotificationService} from '../notifications/notification.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly notifications = inject(NotificationService);

  getContext(): Observable<Context> {
    return this.http.get<Context>(`/api/context`);
  }

  createBlogPost(data: BlogPostDto): Observable<BlogPost> {
    return this.http.post<BlogPost>('/api/blog-posts', data)
      .pipe(
        tap({
          next: () => this.notifications.publishInfo('notifications.created'),
          error: () => this.notifications.publishError('notifications.failedToCreate')
        }),
      );
  }

  updateBlogPost(uid: string, data: BlogPostUpdateDto): Observable<BlogPost> {
    return this.http.patch<BlogPost>(`/api/blog-posts/${uid}`, data)
      .pipe(
        tap({
          next: () => this.notifications.publishInfo('notifications.updated'),
          error: () => this.notifications.publishError('notifications.failedToUpdate')
        }),
      );
  }

  deleteBlogPost(uid: string): Observable<void> {
    return this.http.delete<void>(`/api/blog-posts/${uid}`)
      .pipe(
        tap({
          next: () => this.notifications.publishInfo('notifications.deleted'),
          error: () => this.notifications.publishError('notifications.failedToDelete')
        }),
      );
  }

  getBlogPost(uid: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`/api/blog-posts/${uid}`);
  }

  getBlogPostsPage(pageNumber: number, pageSize: number): Observable<BlogPostsPage> {
    return this.http.get<BlogPostsPage>('/api/blog-posts', {
      params: {pageNumber, pageSize},
    });
  }
}
