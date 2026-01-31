import {Component, input} from '@angular/core';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-content-renderer',
  templateUrl: './content-renderer.html',
  styleUrl: './content-renderer.scss',
  imports: [MarkdownComponent],
})
export class ContentRenderer {
  content = input.required<string>();
}
