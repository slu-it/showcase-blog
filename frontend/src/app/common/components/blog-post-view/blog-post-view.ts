import {Component, input, output} from '@angular/core';
import {BlogPost} from "../../../services/backend/backend.model";
import {DatePipe} from '@angular/common';
import {ContentRenderer} from '../content-renderer/content-renderer';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.html',
  styleUrl: './blog-post-view.scss',
  imports: [DatePipe, ContentRenderer],
})
export class BlogPostView {

  post = input.required<BlogPost>();

  editClicked = output<string>();
  deleteClicked = output<string>();

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
