import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {of} from 'rxjs';
import {App} from './app';

const translations = {
  nav: {
    blogPosts: 'Blog Posts',
    create: 'Create'
  },
  language: {
    label: 'Language',
    en: '🇬🇧 English',
    de: '🇩🇪 German',
    es: '🇪🇸 Spanish',
    sv: '🇸🇪 Swedish'
  }
};

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of(translations);
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: FakeLoader}
        })
      ],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navigation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/"]')?.textContent).toContain('Blog Posts');
  });
});
