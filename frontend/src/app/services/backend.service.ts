import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BlogPost, BlogPostsPage, BlogPostDto} from './backend.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly apiUrl = '/api/blog-posts';

  constructor(private http: HttpClient) {
  }

  create(data: BlogPostDto): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.apiUrl, data);
  }

  getPage(pageNumber: number, pageSize: number): Observable<BlogPostsPage> {
    return this.http.get<BlogPostsPage>(this.apiUrl, {
      params: {pageNumber, pageSize},
    });
  }
}
