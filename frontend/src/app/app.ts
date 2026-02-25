import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {NotificationsContainer} from './common/notifications/notifications-container';
import {ContextService} from './common/context/context.service';
import {ConfigurationStore, Language} from './app.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TranslateModule, NotificationsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly context = inject(ContextService);
  readonly configuration = inject(ConfigurationStore);

  constructor() {
    this.translate.setFallbackLang('en');
  }

  get userCanCreateBlogPosts(): boolean {
    return this.context.user().isAuthor;
  }

  switchLanguage(lang: Language) {
    this.configuration.switchLanguage(lang)
  }
}
