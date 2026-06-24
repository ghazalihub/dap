import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLocalizations {
  private _localizedStrings: { [key: string]: string } = {};
  private _currentLocale: string = 'en';

  constructor(private http: HttpClient) {}

  /**
   * Load the json language file
   */
  async load(locale: string = 'en'): Promise<boolean> {
    this._currentLocale = locale;
    try {
      const jsonLang = await firstValueFrom(
        this.http.get<{ [key: string]: string }>(`assets/lang/${locale}.json`)
      );
      this._localizedStrings = jsonLang || {};
      return true;
    } catch (error) {
      console.error('Error loading localizations:', error);
      return false;
    }
  }

  /**
   * Translate method
   */
  translate(key: string): string {
    return this._localizedStrings[key] || '';
  }

  get currentLocale(): string {
    return this._currentLocale;
  }
}
