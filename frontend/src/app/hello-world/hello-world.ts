import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Backend} from './backend';

@Component({
  selector: 'app-hello-world',
  imports: [ReactiveFormsModule],
  templateUrl: './hello-world.html',
  styleUrl: './hello-world.scss',
})
export class HelloWorld {
  private destroyRef = inject(DestroyRef);
  private backend = inject(Backend);

  form = new FormGroup({
    name: new FormControl('World!', Validators.required),
  });
  message = '-';

  handleSubmit() {
    this.message = 'loading ...';
    this.backend.post(this.form.value.name ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.message = response.message,
        error: () => this.message = 'Error loading message'
      });
  }
}
