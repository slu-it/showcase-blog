import {Component, inject} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private translate = inject(TranslateService);
  currentLang: string;

  constructor() {
    this.translate.setFallbackLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.currentLang = browserLang?.match(/en|de|es|sv/) ? browserLang : 'en';
    this.translate.use(this.currentLang);
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
