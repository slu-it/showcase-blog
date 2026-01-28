import {Component, computed, input} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-error-message',
  templateUrl: './error.message.html',
  styleUrl: './error.message.scss',
  imports: [TranslateModule, NgOptimizedImage],
})
export class ErrorMessage {
  private fileNames: Record<number, string> = {
    403: 'status-403.webp',
    404: 'status-404.webp',
  };
  private messageKeys: Record<number, string> = {
    403: 'errors.responses.forbidden',
    404: 'errors.responses.notFound',
  };

  status = input.required<number>();

  imagePath = computed(() => {
    return `assets/img/errors/${this.fileNames[this.status()] ?? 'status-oops.webp'}`;
  });

  messageKey = computed(() => {
    return this.messageKeys[this.status()] ?? 'errors.responses.oops';
  });
}
