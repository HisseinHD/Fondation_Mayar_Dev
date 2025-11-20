import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <!-- Bouton toggle pour petit écran -->
    <button class="sidebar-toggle" (click)="toggleSidebar()">☰</button>

    <header class="admin-header">
      <h1 class='th1' >Administration Fondation Mayar</h1>
      <img src="assets/cap12.png" alt="Logo Fondation Mayar" class="logo" />
    </header>
    <aside class="sidebar" [class.open]="sidebarOpen">
      <ul class="sidebar-menu">
        <!-- HOME -->
        <li>
          <a data-bs-toggle="collapse" href="#menuHome" role="button" aria-expanded="false">
            <i class="fas fa-home me-2"></i> Accueil
          </a>
          <ul class="collapse sub-menu" id="menuHome">
            <li><a routerLink="/admin/dashboard">Tableau de bord</a></li>
          </ul>
        </li>

        <!-- FORMATIONS -->
        <li>
          <a data-bs-toggle="collapse" href="#menuFormation" role="button" aria-expanded="false">
            <i class="fas fa-graduation-cap me-2"></i> Gérer Formations
          </a>
          <ul class="collapse sub-menu" id="menuFormation">
            <li><a routerLink="/admin/formation">Liste formations</a></li>
            <li><a routerLink="/admin/create-forma">Créer une formation</a></li>
          </ul>
        </li>

        <!-- ACTUALITÉS -->
        <li>
          <a data-bs-toggle="collapse" href="#menuActu" role="button">
            <i class="fas fa-newspaper me-2"></i> Actualités
          </a>
          <ul class="collapse sub-menu" id="menuActu">
            <li><a routerLink="/admin/actualite">Créer une actualité</a></li>
            <li><a routerLink="/admin/actualites">Liste actualités</a></li>
          </ul>
        </li>

        <!-- PARTICIPANTS -->
        <li>
          <a data-bs-toggle="collapse" href="#menuUsers" role="button">
            <i class="fas fa-users me-2"></i> Participants
          </a>
          <ul class="collapse sub-menu" id="menuUsers">
            <li><a routerLink="/admin/gestion-candidats">Liste participants</a></li>
          </ul>
        </li>

        <!-- STATS -->
        <li>
          <a routerLink="/admin/stats"> <i class="fas fa-chart-line me-2"></i> Statistiques </a>
        </li>

        <!-- PARAMÈTRES -->
        <li>
          <a routerLink="/admin/parametres"> <i class="fas fa-cog me-2"></i> Paramètres </a>
        </li>

        <!-- LOGOUT -->
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt me-2"></i> Déconnexion
          </button>
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
