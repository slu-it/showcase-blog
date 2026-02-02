import {Component, input, output} from '@angular/core';
import {PageInfo} from '../../../common/blog-posts/blog-posts.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  imports: [],
})
export class Pagination {
  readonly page = input.required<PageInfo>();
  readonly pageChanged = output<number>();

  get hasPreviousPage(): boolean {
    return this.page().number > 1;
  }

  get hasNextPage(): boolean {
    return this.page().number < this.page().totalPages;
  }

  handleFirstClicked() {
    this.pageChanged.emit(1);
  }

  handlePreviousClicked() {
    this.pageChanged.emit(this.page().number - 1);
  }

  handleNextClicked() {
    this.pageChanged.emit(this.page().number + 1);
  }

  handleLastClicked() {
    this.pageChanged.emit(this.page().totalPages);
  }
}
