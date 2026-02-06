import {Component, input, output} from '@angular/core';
import {BlogPost} from "../blog-posts.model";
import {DatePipe} from '@angular/common';
import {MarkdownRenderer} from '../../markdown-renderer/markdown-renderer';
import {ActionButton} from '../../action-button/action-button';
import {ConfirmationDialog} from '../../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.html',
  styleUrl: './blog-post-view.scss',
  imports: [DatePipe, MarkdownRenderer, ActionButton, ConfirmationDialog],
})
export class BlogPostView {

  readonly post = input.required<BlogPost>();

  readonly editClicked = output<string>();
  readonly deleteClicked = output<string>();

  protected showDeleteConfirmation = false;

  get blogPostCanBeEdited(): boolean {
    return this.post()._links?.patch != null;
  }

  get blogPostCanBeDeleted(): boolean {
    return this.post()._links?.delete != null;
  }

  handleEditClicked() {
    this.editClicked.emit(this.post().uid);
  }

  handleDeleteClicked() {
    this.showDeleteConfirmation = true;
  }

  handleDeleteConfirmed() {
    this.showDeleteConfirmation = false;
    this.deleteClicked.emit(this.post().uid);
  }

  handleDeleteCancelled() {
    this.showDeleteConfirmation = false;
  }
}
