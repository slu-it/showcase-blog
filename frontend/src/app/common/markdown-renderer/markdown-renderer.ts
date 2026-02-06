import {Component, input, ViewEncapsulation} from '@angular/core';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.html',
  styleUrl: './markdown-renderer.scss',
  imports: [MarkdownComponent],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownRenderer {
  readonly data = input.required<string>();
}
