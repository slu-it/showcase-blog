import {Component, computed, input} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
  imports: [TranslateModule, NgOptimizedImage],
})
export class ErrorState {

  private fileNames: Record<number, string> = {
    403: 'status-403.webp',
    404: 'status-404.webp',
  };
  private messageKeys: Record<number, string> = {
    403: 'errors.responses.forbidden',
    404: 'errors.responses.notFound',
  };

  readonly status = input.required<number>();

  readonly imagePath = computed(() => {
    return `assets/img/errors/${this.fileNames[this.status()] ?? 'status-oops.webp'}`;
  });

  readonly messageKey = computed(() => {
    return this.messageKeys[this.status()] ?? 'errors.responses.oops';
  });
}
