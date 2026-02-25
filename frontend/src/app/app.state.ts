import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

const LANGUAGES = ['en', 'de', 'es', 'sv'] as const;
const LANGUAGE_STORAGE_KEY = 'language';

export type Language = typeof LANGUAGES[number];

type ConfigurationState = {
  currentLanguage: Language;
};

export const ConfigurationStore = signalStore(
  {providedIn: 'root'},
  withState(() => {
    const language = determineInitialLanguage()
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    inject(TranslateService).use(language)

    return {currentLanguage: language} as ConfigurationState
  }),
  withMethods((store, translate = inject(TranslateService)) => ({
    switchLanguage(language: Language): void {
      patchState(store, {currentLanguage: language});
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      translate.use(language)
    },
  }))
);

function determineInitialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(stored)) {
    return stored
  }

  const browser = inject(TranslateService).getBrowserLang();
  if (isSupportedLanguage(browser)) {
    return browser
  }

  return 'en'
}

function isSupportedLanguage(value: string | null | undefined): value is Language {
  return value != null && (LANGUAGES as readonly string[]).includes(value)
}
