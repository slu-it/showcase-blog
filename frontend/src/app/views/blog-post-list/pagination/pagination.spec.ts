import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Pagination} from './pagination';
import {PageInfo} from '../../../common/blog-posts/blog-posts.model';

@Component({
  template: `<app-pagination [page]="page" (pageChanged)="onPageChanged($event)" />`,
  imports: [Pagination],
})
class TestHost {
  page: PageInfo = {size: 10, totalElements: 50, totalPages: 5, number: 3};
  onPageChanged = jest.fn();
}

describe('Pagination', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const queryByTestId = (id: string) =>
    fixture.debugElement.query(By.css(`[data-testid="${id}"]`)).nativeElement;

  const getFirstButton = () => queryByTestId('first') as HTMLButtonElement;
  const getPreviousButton = () => queryByTestId('previous') as HTMLButtonElement;
  const getNextButton = () => queryByTestId('next') as HTMLButtonElement;
  const getLastButton = () => queryByTestId('last') as HTMLButtonElement;

  const getPageDisplay = () => queryByTestId('page-display') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should display the current page and total pages', () => {
      expect(getPageDisplay().textContent?.trim()).toBe('3/5');
    });
  });

  describe('navigation buttons', () => {
    it('should disable first and previous buttons on the first page', () => {
      host.page = {...host.page, number: 1};
      fixture.detectChanges();

      expect(getFirstButton().disabled).toBe(true);
      expect(getPreviousButton().disabled).toBe(true);
      expect(getNextButton().disabled).toBe(false);
      expect(getLastButton().disabled).toBe(false);
    });

    it('should disable next and last buttons on the last page', () => {
      host.page = {...host.page, number: 5};
      fixture.detectChanges();

      expect(getFirstButton().disabled).toBe(false);
      expect(getPreviousButton().disabled).toBe(false);
      expect(getNextButton().disabled).toBe(true);
      expect(getLastButton().disabled).toBe(true);
    });

    it('should enable all buttons on a middle page', () => {
      expect(getFirstButton().disabled).toBe(false);
      expect(getPreviousButton().disabled).toBe(false);
      expect(getNextButton().disabled).toBe(false);
      expect(getLastButton().disabled).toBe(false);
    });
  });

  describe('page changes', () => {
    it('should emit 1 when first is clicked', () => {
      getFirstButton().click();

      expect(host.onPageChanged).toHaveBeenCalledWith(1);
    });

    it('should emit the previous page number when previous is clicked', () => {
      getPreviousButton().click();

      expect(host.onPageChanged).toHaveBeenCalledWith(2);
    });

    it('should emit the next page number when next is clicked', () => {
      getNextButton().click();

      expect(host.onPageChanged).toHaveBeenCalledWith(4);
    });

    it('should emit the total pages when last is clicked', () => {
      getLastButton().click();

      expect(host.onPageChanged).toHaveBeenCalledWith(5);
    });
  });
});
