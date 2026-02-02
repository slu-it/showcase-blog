import {inject, Injectable, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Context, User} from './context.model';

const dummyUser = {username: 'dummy', isAuthor: false, isAdmin: false};

@Injectable({providedIn: 'root'})
export class ContextService {
  private readonly http = inject(HttpClient);

  private readonly _user = signal<User>(dummyUser);
  readonly user = this._user.asReadonly();

  /**
   * This is called on application initialization.
   * Therefore, the _user should never actually be "dummyUser"
   */
  async refresh(): Promise<void> {
    const foo = this.http.get<Context>(`/api/context`);
    const context = await firstValueFrom(foo);
    this._user.set(context.user);
  }
}
