import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BlogPostsPage} from '../../model/blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostListService {
  private readonly apiUrl = '/api/blog-posts';

  constructor(private http: HttpClient) {
  }

  getPage(pageNumber: number, pageSize: number): Observable<BlogPostsPage> {
    return this.http.get<BlogPostsPage>(this.apiUrl, {
      params: {pageNumber, pageSize},
    });
  }
}
