import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BlogPost, BlogPostDto, BlogPostsPage, BlogPostUpdateDto} from './backend.model';

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

  update(uid: string, data: BlogPostUpdateDto): Observable<BlogPost> {
    return this.http.patch<BlogPost>(this.apiUrl + '/' + uid, data);
  }

  get(uid: String): Observable<BlogPost> {
    return this.http.get<BlogPost>(this.apiUrl + '/' + uid);
  }

  getPage(pageNumber: number, pageSize: number): Observable<BlogPostsPage> {
    return this.http.get<BlogPostsPage>(this.apiUrl, {
      params: {pageNumber, pageSize},
    });
  }
}
