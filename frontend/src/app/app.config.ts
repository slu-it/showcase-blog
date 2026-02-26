import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, TitleStrategy, withComponentInputBinding} from '@angular/router';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {MARKED_OPTIONS, MarkedRenderer, provideMarkdown} from 'ngx-markdown';
import {Tokens} from 'marked';

import {routes} from './app.routes';
import {TranslatedTitleStrategy} from './common/translated-title.strategy';
import {ContextService} from './common/context/context.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en'
    }),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    }),
    {provide: TitleStrategy, useClass: TranslatedTitleStrategy},
    provideAppInitializer(() => inject(ContextService).refresh()),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          renderer: (() => {
            const renderer = new MarkedRenderer();
            renderer.link = (token: Tokens.Link) => {
              if (token.href.startsWith('http')) {
                // assuming external link
                return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">${token.text} ⧉</a>`;
              }
              // assuming internal link
              return `<a href="${token.href}">${token.text}</a>`;
            };
            return renderer;
          })()
        }
      }
    })
  ]
};
