import {Component, inject} from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinner {
  protected readonly isLoading = inject(LoadingService).isLoading;
}
