import {TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {RouterStateSnapshot} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslatedTitleStrategy} from './translated-title.strategy';

describe('TranslatedTitleStrategy', () => {
  let strategy: TranslatedTitleStrategy;
  let title: Title;
  let translateService: TranslateService;

  const snapshotWithTitle = (routeTitle?: string) => {
    const snapshot = {} as RouterStateSnapshot;
    jest.spyOn(strategy, 'buildTitle').mockReturnValue(routeTitle);
    return snapshot;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });

    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {'pages.home': 'Home'});
    translateService.setTranslation('de', {'pages.home': 'Startseite'});
    translateService.use('en');

    strategy = TestBed.inject(TranslatedTitleStrategy);
    title = TestBed.inject(Title);
    title.setTitle('INITIAL');
  });

  describe('updateTitle with snapshot', () => {
    it('should set the document title to the translated route title', () => {
      strategy.updateTitle(snapshotWithTitle('pages.home'));

      expect(title.getTitle()).toBe('Home');
    });

    it('should not set the document title when the route has no title', () => {
      const initialTitle = title.getTitle();

      strategy.updateTitle(snapshotWithTitle(undefined));

      expect(title.getTitle()).toBe(initialTitle);
    });
  });

  describe('updateTitle on language change', () => {
    it('should re-translate and update the document title when the language changes', () => {
      strategy.updateTitle(snapshotWithTitle('pages.home'));
      expect(title.getTitle()).toBe('Home');

      jest.spyOn(strategy, 'updateTitle');
      translateService.use('de');

      expect(title.getTitle()).toBe('Startseite');
      expect(strategy.updateTitle).toHaveBeenCalled();
    });

    it('should not set the document title on language change if no title was previously resolved', () => {
      const initialTitle = title.getTitle();

      translateService.use('de');

      expect(title.getTitle()).toBe(initialTitle);
    });
  });
});
