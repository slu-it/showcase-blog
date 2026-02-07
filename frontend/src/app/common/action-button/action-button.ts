import {Component, input, output} from '@angular/core';
import {ActionType} from './action-button.model';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.html',
  styleUrl: './action-button.scss',
})
export class ActionButton {
  readonly type = input.required<ActionType>();
  readonly clicked = output<void>();

  handleClick() {
    this.clicked.emit();
  }
}
