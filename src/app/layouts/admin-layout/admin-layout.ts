import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Bouton toggle pour petit écran -->
    <button class="sidebar-toggle" (click)="toggleSidebar()">☰</button>

    <header class="admin-header">
      <h1>Administration Fondation Mayar</h1>
    </header>

    <aside class="sidebar" [class.open]="sidebarOpen">
      <ul class="sidebar-menu">
        <li><a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li><a routerLink="/admin/formation" routerLinkActive="active">Formations</a></li>
        <li>
          <a routerLink="/admin/create-forma" routerLinkActive="active">Créer une formation</a>
        </li>
        <li><a routerLink="/admin/actualite" routerLinkActive="active">Actualités</a></li>
        <li><a routerLink="/admin/gestion-candidats" routerLinkActive="active">Participants</a></li>
        <li><a routerLink="/admin/actualites" routerLinkActive="active">ListActualite</a></li>
        <li><a routerLink="/admin/stats" routerLinkActive="active">Statistiques</a></li>
        <li><a routerLink="/admin/parametres" routerLinkActive="active">Paramètres</a></li>
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">Déconnexion</button>
        </div>
      </ul>
    </aside>

    <main class="admin-content" [class.blurred]="sidebarOpen">
      <router-outlet></router-outlet>
    </main>

    <footer class="admin-footer">
      <p>© 2025 Fondation Mayar</p>
    </footer>
  `,
  styleUrls: ['./admin-layout.css'],
})
export class AdminLayoutComponent {
  sidebarOpen = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    // Supprimer le token et le rôle
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Rediriger vers la page de login
    this.router.navigate(['/login']);
  }
}
