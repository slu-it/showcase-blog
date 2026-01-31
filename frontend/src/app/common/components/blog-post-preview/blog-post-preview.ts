import {Component, input, output} from '@angular/core';
import {BlogPost} from "../../../services/backend/backend.model";
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-blog-post-preview',
  templateUrl: './blog-post-preview.html',
  styleUrl: './blog-post-preview.scss',
  imports: [DatePipe, RouterLink],
})
export class BlogPostPreview {

  post = input.required<BlogPost>();

  editClicked = output<string>();
  deleteClicked = output<string>();
  titleClicked = output<string>();

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

  handleTitleClicked() {
    this.titleClicked.emit(this.post().uid);
  }
}
