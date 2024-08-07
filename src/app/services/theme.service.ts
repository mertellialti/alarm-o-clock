import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  protected isDark: boolean = true;

  constructor() { 
    this.checkInitialTheme();
  }
  
  async checkInitialTheme() {
    const isDarkTheme = await Preferences.get({ key: 'dark-theme' });
    if (isDarkTheme?.value !== null) {
      this.isDark = isDarkTheme.value === 'true';
    } else {
      // Set the theme based on the time if no preference is stored
      const currentHour = new Date().getHours();
      this.isDark = currentHour >= 21 || currentHour < 4; // Night time is considered from 9 PM to 4 AM
    }
    document.body.classList.toggle('dark', this.isDark);
  }

  async toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark', this.isDark);
    await Preferences.set({ key: 'dark-theme', value: this.isDark ? 'true' : 'false' });
    return this.isDark;
  }

  getInitialTheme(){
    return this.isDark;
  }
}
