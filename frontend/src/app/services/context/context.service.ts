import {inject, Injectable, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {User} from '../backend/backend.model';
import {BackendService} from '../backend/backend.service';

const dummyUser = {username: 'dummy', isAuthor: false, isAdmin: false};

@Injectable({providedIn: 'root'})
export class ContextService {
  private readonly backend = inject(BackendService);
  private readonly _user = signal<User>(dummyUser);

  readonly user = this._user.asReadonly();

  /**
   * This is called on application initialization.
   * Therefore, the _user should never actually be "undefined"
   */
  async refresh(): Promise<void> {
    const context = await firstValueFrom(this.backend.getContext());
    this._user.set(context.user);
  }
}
