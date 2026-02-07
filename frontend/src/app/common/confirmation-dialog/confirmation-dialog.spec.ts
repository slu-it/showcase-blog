import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ConfirmationDialog} from './confirmation-dialog';

@Component({
  template: `<app-confirmation-dialog [message]="message" (confirmed)="onConfirmed()" (cancelled)="onCancelled()" />`,
  imports: [ConfirmationDialog],
})
class TestHost {
  message = 'some.message.key';
  onConfirmed = jest.fn();
  onCancelled = jest.fn();
}

describe('ConfirmationDialog', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const getOverlay = () =>
    fixture.debugElement.query(By.css('.overlay')).nativeElement as HTMLElement;

  const getDialog = () =>
    fixture.debugElement.query(By.css('.dialog')).nativeElement as HTMLElement;

  const getMessage = () =>
    fixture.debugElement.query(By.css('.message')).nativeElement as HTMLElement;

  const getYesButton = () =>
    fixture.debugElement.query(By.css('.yes')).nativeElement as HTMLButtonElement;

  const getNoButton = () =>
    fixture.debugElement.query(By.css('.no')).nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, TranslateModule.forRoot()],
    }).compileComponents();

    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      'some.message.key': 'Translated message',
      'confirmation.yes': 'Yes',
      'confirmation.no': 'No',
    });
    translateService.use('en');

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('translations', () => {
    it('should display the translated message', () => {
      expect(getMessage().textContent?.trim()).toBe('Translated message');
    });

    it('should display the translated yes button label', () => {
      expect(getYesButton().textContent?.trim()).toBe('Yes');
    });

    it('should display the translated no button label', () => {
      expect(getNoButton().textContent?.trim()).toBe('No');
    });
  });

  describe('confirmed', () => {
    it('should emit when yes button is clicked', () => {
      getYesButton().click();

      expect(host.onConfirmed).toHaveBeenCalledTimes(1);
      expect(host.onCancelled).not.toHaveBeenCalled();
    });

    it('should emit when enter is pressed inside the dialog', () => {
      getDialog().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));

      expect(host.onConfirmed).toHaveBeenCalledTimes(1);
      expect(host.onCancelled).not.toHaveBeenCalled();
    });
  });

  describe('cancelled', () => {
    it('should emit when no button is clicked', () => {
      getNoButton().click();

      expect(host.onCancelled).toHaveBeenCalledTimes(1);
      expect(host.onConfirmed).not.toHaveBeenCalled();
    });

    it('should emit when overlay is clicked', () => {
      getOverlay().click();

      expect(host.onCancelled).toHaveBeenCalledTimes(1);
      expect(host.onConfirmed).not.toHaveBeenCalled();
    });

    it('should emit when escape is pressed', () => {
      getOverlay().dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));

      expect(host.onCancelled).toHaveBeenCalledTimes(1);
      expect(host.onConfirmed).not.toHaveBeenCalled();
    });
  });

  describe('click propagation', () => {
    it('should not emit when clicking inside the dialog but not on a button', () => {
      getMessage().click();

      expect(host.onConfirmed).not.toHaveBeenCalled();
      expect(host.onCancelled).not.toHaveBeenCalled();
    });
  });

  describe('focus', () => {
    it('should focus the yes button on init', () => {
      expect(document.activeElement).toBe(getYesButton());
    });
  });
});
