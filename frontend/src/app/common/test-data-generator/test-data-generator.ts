import {Component, inject, output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * This component is only for testing / demonstration and is not visible by normal users.
 * On a button click it tells the backend to generate a certain amount of random blog posts.
 */
@Component({
  selector: 'app-test-data-generator',
  templateUrl: 'test-data-generator.html',
  styleUrl: 'test-data-generator.scss',
  imports: [
    TranslatePipe
  ]
})
export class TestDataGenerator {
  private readonly http = inject(HttpClient);
  readonly generationCompleted = output<number>();

  handleGenerateClicked() {
    const amount = 25;
    this.http.post<void>(`/api/blog-posts-generator`, {amount: amount})
      .subscribe({
        next: () => this.generationCompleted.emit(amount),
        error: error => console.log(`Blog Post generation failed: ${error}`)
      });
  }
}
