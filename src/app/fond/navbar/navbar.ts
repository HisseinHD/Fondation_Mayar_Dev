import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  menuOpen = false;
  currentLang = 'fr';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  setLanguage(lang: string) {
    this.currentLang = lang;

    const select = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.style.textAlign = 'right';
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.style.textAlign = 'left';
    }
  }
}
