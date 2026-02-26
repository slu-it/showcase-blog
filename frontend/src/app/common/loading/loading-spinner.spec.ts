import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {LoadingSpinner} from './loading-spinner';
import {LoadingService} from './loading.service';

describe('LoadingSpinner', () => {
  let fixture: ComponentFixture<LoadingSpinner>;
  let loadingService: LoadingService;

  const getOverlay = () => fixture.debugElement.query(By.css('.overlay'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinner],
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService);
    fixture = TestBed.createComponent(LoadingSpinner);
    fixture.detectChanges();
  });

  describe('when not loading', () => {
    it('should not render the overlay', () => {
      expect(getOverlay()).toBeNull();
    });
  });

  describe('when loading', () => {
    beforeEach(() => {
      loadingService.increment();
      fixture.detectChanges();
    });

    it('should render the overlay', () => {
      expect(getOverlay()).not.toBeNull();
    });

    it('should render the spinner inside the overlay', () => {
      const spinner = fixture.debugElement.query(By.css('.overlay .spinner'));
      expect(spinner).not.toBeNull();
    });

    it('should remove the overlay once loading is done', () => {
      loadingService.decrement();
      fixture.detectChanges();

      expect(getOverlay()).toBeNull();
    });
  });
});
