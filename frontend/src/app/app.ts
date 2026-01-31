import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Notifications} from './common/components/notification/notifications';
import {ContextService} from './services/context/context.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TranslateModule, Notifications],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private static readonly SUPPORTED_LANGUAGES = /^(en|de|es|sv)$/;
  private static readonly LANGUAGE_STORAGE_KEY = 'lang';

  private translate = inject(TranslateService);
  private context = inject(ContextService);

  currentLang: string;

  constructor() {
    this.translate.setFallbackLang('en');
    const stored = localStorage.getItem(App.LANGUAGE_STORAGE_KEY);
    if (stored?.match(App.SUPPORTED_LANGUAGES)) {
      this.currentLang = stored;
    } else {
      const browserLang = this.translate.getBrowserLang();
      this.currentLang = browserLang?.match(App.SUPPORTED_LANGUAGES) ? browserLang : 'en';
    }
    this.translate.use(this.currentLang);
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    localStorage.setItem(App.LANGUAGE_STORAGE_KEY, lang);
    this.translate.use(lang);
  }

  canCreateBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }
}
