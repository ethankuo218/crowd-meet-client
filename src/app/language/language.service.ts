import { Injectable, inject } from '@angular/core';
import { Language, LanguageModel } from './language.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translateService = inject(TranslateService);
  private languages: Array<LanguageModel> = [];
  private _currentLanguage: Language = Language.ENGLISH;

  constructor() {
    this.languages.push(
      { name: 'English', code: Language.ENGLISH },
      { name: 'Korean', code: Language.KOREAN },
      { name: 'Thai', code: Language.THAI },
      { name: '繁體中文', code: Language.CHINESE }
    );
  }

  getLanguages(): LanguageModel[] {
    return this.languages;
  }

  setLanguage(language: Language): void {
    this._currentLanguage = language;
    this.translateService.use(language);
  }

  get currentLanguage(): Language {
    return this._currentLanguage;
  }

  set currentLanguage(language: Language) {
    this._currentLanguage = language;
  }
}
