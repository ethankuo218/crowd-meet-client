export interface LanguageModel {
  name: string;
  code: Language;
}

export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRANCH = 'fr',
  KOREAN = 'ko',
  JAPANESE = 'ja',
  THAI = 'th',
  CHINESE = 'zh-TW'
}
