import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BlogPost, CreateBlogPostRequest} from '../../model/blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostFormService {
  private readonly apiUrl = '/api/editor/blog-posts';

  constructor(private http: HttpClient) {
  }

  create(data: CreateBlogPostRequest): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.apiUrl, data);
  }
}
