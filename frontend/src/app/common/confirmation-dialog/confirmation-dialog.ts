import {AfterViewInit, Component, ElementRef, input, output, viewChild} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
  imports: [TranslatePipe],
})
export class ConfirmationDialog implements AfterViewInit {
  readonly message = input.required<string>();
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private yesButton = viewChild.required<ElementRef<HTMLButtonElement>>('yesButton');

  ngAfterViewInit(): void {
    this.yesButton().nativeElement.focus();
  }

  handleYes() {
    this.confirmed.emit();
  }

  handleNo() {
    this.cancelled.emit();
  }
}
