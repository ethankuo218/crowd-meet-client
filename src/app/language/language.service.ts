import { Injectable } from '@angular/core';
import { Language, LanguageModel } from './language.model';

@Injectable()
export class LanguageService {
  private languages: Array<LanguageModel> = [];
  private _currentLanguage: Language = Language.ENGLISH;

  constructor() {
    this.languages.push(
      { name: 'English', code: Language.ENGLISH },
      { name: 'Spanish', code: Language.SPANISH },
      { name: 'French', code: Language.FRANCH }
    );
  }

  getLanguages(): LanguageModel[] {
    return this.languages;
  }

  get currentLanguage(): Language {
    return this._currentLanguage;
  }

  set currentLanguage(language: Language) {
    this._currentLanguage = language;
  }
}
