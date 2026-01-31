import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, TitleStrategy} from '@angular/router';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {provideMarkdown} from 'ngx-markdown';

import {routes} from './app.routes';
import {TranslatedTitleStrategy} from './translated-title.strategy';
import {ContextService} from './services/context/context.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
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
    provideMarkdown()
  ]
};
