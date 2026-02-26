import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {finalize} from 'rxjs';
import {LoadingService} from './loading.service';

export function loadingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const loadingService = inject(LoadingService);
  loadingService.increment();
  return next(req).pipe(finalize(() => loadingService.decrement()));
}
