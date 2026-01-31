import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {ErrorMessage} from './error.message';

@Component({
  template: `<app-error-message [status]="status" />`,
  imports: [ErrorMessage],
})
class TestHost {
  status = 404;
}

describe('ErrorMessage', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const queryByTestId = (id: string) =>
    fixture.debugElement.query(By.css(`[data-testid="${id}"]`));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(queryByTestId('error-image')).toBeTruthy();
    expect(queryByTestId('error-message')).toBeTruthy();
  });

  describe('imagePath', () => {
    it.each([
      {status: 403, expected: 'assets/img/errors/status-403.webp'},
      {status: 404, expected: 'assets/img/errors/status-404.webp'},
      {status: 500, expected: 'assets/img/errors/status-oops.webp'},
    ])('should return correct image for status $status', ({status, expected}) => {
      host.status = status;
      fixture.detectChanges();

      const component = fixture.debugElement.query(By.directive(ErrorMessage)).componentInstance as ErrorMessage;
      expect(component.imagePath()).toBe(expected);
    });
  });

  describe('messageKey', () => {
    it.each([
      {status: 403, expected: 'errors.responses.forbidden'},
      {status: 404, expected: 'errors.responses.notFound'},
      {status: 500, expected: 'errors.responses.oops'},
    ])('should show correct message for status $status', ({status, expected}) => {
      host.status = status;
      fixture.detectChanges();

      expect(queryByTestId('error-message').nativeElement.textContent.trim()).toBe(expected);
    });
  });
});
