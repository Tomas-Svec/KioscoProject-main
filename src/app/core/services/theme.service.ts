import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeKey = 'dark-mode';

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme(); // Solo carga el tema si está en el navegador
    }
  }

  toggleDarkMode(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark');
      const isDarkMode = document.documentElement.classList.contains('dark');
      localStorage.setItem(this.darkModeKey, JSON.stringify(isDarkMode));
    }
  }

  private loadTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.darkModeKey);
      if (savedTheme && JSON.parse(savedTheme)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
