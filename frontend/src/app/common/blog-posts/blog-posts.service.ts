import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {BlogPost, BlogPostDto, BlogPostsPage, BlogPostUpdateDto} from './blog-posts.model';
import {NotificationsService} from '../notifications/notifications.service';

@Injectable({providedIn: 'root'})
export class BlogPostsService {
  private readonly http = inject(HttpClient);
  private readonly notifications = inject(NotificationsService);

  private readonly basePath = '/api/blog-posts';

  createBlogPost(data: BlogPostDto): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.basePath, data)
      .pipe(
        tap({
          next: () => this.notifications.publishInfo('notifications.created'),
          error: () => this.notifications.publishError('notifications.failedToCreate')
        }),
      );
  }

  updateBlogPost(uid: string, data: BlogPostUpdateDto): Observable<BlogPost> {
    return this.http.patch<BlogPost>(`${this.basePath}/${uid}`, data)
      .pipe(
        tap({
          next: () => this.notifications.publishInfo('notifications.updated'),
          error: () => this.notifications.publishError('notifications.failedToUpdate')
        }),
      );
  }

  deleteBlogPost(uid: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${uid}`)
      .pipe(
        tap({
          next: () => this.notifications.publishInfo('notifications.deleted'),
          error: () => this.notifications.publishError('notifications.failedToDelete')
        }),
      );
  }

  getBlogPost(uid: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.basePath}/${uid}`);
  }

  getBlogPostsPage(pageNumber: number, pageSize: number): Observable<BlogPostsPage> {
    return this.http.get<BlogPostsPage>(this.basePath, {
      params: {pageNumber, pageSize},
    });
  }
}
