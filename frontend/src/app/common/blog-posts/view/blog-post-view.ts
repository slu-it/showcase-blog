import {Component, input, output} from '@angular/core';
import {BlogPost} from "../blog-posts.model";
import {DatePipe} from '@angular/common';
import {MarkdownRenderer} from '../../markdown-renderer/markdown-renderer';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.html',
  styleUrl: './blog-post-view.scss',
  imports: [DatePipe, MarkdownRenderer],
})
export class BlogPostView {

  readonly post = input.required<BlogPost>();

  readonly editClicked = output<string>();
  readonly deleteClicked = output<string>();

  canBeEdited(): boolean {
    return this.post()._links?.patch != null;
  }

  canBeDeleted(): boolean {
    return this.post()._links?.delete != null;
  }

  handleEditClicked() {
    this.editClicked.emit(this.post().uid);
  }

  handleDeleteClicked() {
    this.deleteClicked.emit(this.post().uid);
  }
}
