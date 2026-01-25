import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HelloResponse} from './backend.model';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private readonly apiUrl = '/api/hello';

  constructor(private http: HttpClient) {
  }

  get(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>(this.apiUrl);
  }

  post(name: string): Observable<HelloResponse> {
    return this.http.post<HelloResponse>(this.apiUrl, {name: name});
  }
}
