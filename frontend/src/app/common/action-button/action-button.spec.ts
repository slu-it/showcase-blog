import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ActionButton} from './action-button';
import {ActionType} from './action-button.model';

@Component({
  template: `<app-action-button [type]="type" (clicked)="onClick()" />`,
  imports: [ActionButton],
})
class TestHost {
  type: ActionType = '✏️';
  onClick = jest.fn();
}

describe('ActionButton', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const getButton = () =>
    fixture.debugElement.query(By.css('button')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('type', () => {
    it.each([
      {type: '✏️' as const},
      {type: '🗑️' as const},
    ])('should display "$type" as button text', ({type}) => {
      host.type = type;
      fixture.detectChanges();

      expect(getButton().textContent.trim()).toBe(type);
    });
  });

  describe('clicked', () => {
    it('should emit when button is clicked', () => {
      getButton().click();

      expect(host.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
