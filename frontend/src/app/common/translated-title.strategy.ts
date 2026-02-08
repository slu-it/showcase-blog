import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => {
      this.updateTitle();
    });
  }

  private currentTitleKey?: string;

  override updateTitle(snapshot?: RouterStateSnapshot) {
    if (snapshot) {
      this.currentTitleKey = this.buildTitle(snapshot);
    }
    if (this.currentTitleKey) {
      this.title.setTitle(this.translate.instant(this.currentTitleKey));
    }
  }
}
