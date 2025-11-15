import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActualiteService, Actualite } from '../../services/actualite';

interface ActualiteModel {
  _id?: string;
  titre: string;
  description?: string;
  contenu?: string;
  image?: string;
  createdAt?: string;
  user?: {
    nom?: string;
    prenom?: string;
    email?: string;
  };
}

@Component({
  selector: 'app-actualite-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actualite-list.html',
  styleUrls: ['./actualite-list.css'],
})
export class ActualiteListComponent implements OnInit {
  actualites: ActualiteModel[] = [];
  filteredActualites: ActualiteModel[] = [];
  loading = true;
  errorMessage = '';
  isConnected = false;
  searchTerm: string = '';

  // Pagination
  page: number = 1;
  limit: number = 5;
  total: number = 0;
  totalPages: number = 0;

  constructor(private actualiteService: ActualiteService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isConnected = !!token;
    this.getAllActualites();
  }

  // 🔹 Récupérer toutes les actualités
  getAllActualites(): void {
    this.loading = true;
    this.actualiteService.getAll().subscribe({
      next: (response) => {
        const list: Actualite[] = response.actualites || response;
        // Trier les actualités par date décroissante (nouvelles en tête)
        this.actualites = list
          .map((a) => ({
            ...a,
            createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : undefined,
          }))
          .sort((a, b) =>
            b.createdAt && a.createdAt
              ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              : 0
          );

        this.total = this.actualites.length;
        this.totalPages = Math.ceil(this.total / this.limit);

        // Initialisation de la page filtrée
        this.updateFilteredActualites();

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement actualités:', err);
        this.errorMessage = 'Erreur lors du chargement des actualités.';
        this.loading = false;
      },
    });
  }

  filtrerActualites(): void {
    const term = this.searchTerm.toLowerCase();
    this.updateFilteredActualites(term);
  }

  private updateFilteredActualites(searchTerm: string = ''): void {
    const filtered = this.actualites.filter(
      (act) =>
        act.titre.toLowerCase().includes(searchTerm) ||
        (act.description && act.description.toLowerCase().includes(searchTerm))
    );
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    this.filteredActualites = filtered.slice(start, end);
    this.totalPages = Math.ceil(filtered.length / this.limit);
  }

  ajouterActualite(): void {
    this.router.navigate(['/admin/ajouter-actualite']);
  }

  openActualiteDetail(id?: string): void {
    if (!id) return;
    this.router.navigate([this.isConnected ? '/admin/actualite' : '/actualite', id]);
  }

  modifierActualite(id?: string): void {
    if (!id) return;
    this.router.navigate(['/admin/actualite/modifier', id]);
  }

  supprimerActualite(id?: string): void {
    if (!id || !confirm('Confirmer la suppression de cette actualité ?')) return;
    this.actualiteService.delete(id).subscribe({
      next: () => {
        this.actualites = this.actualites.filter((a) => a._id !== id);
        this.updateFilteredActualites(this.searchTerm);
      },
      error: (err) => {
        console.error('Erreur suppression actualité:', err);
      },
    });
  }

  pageSuivante(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateFilteredActualites(this.searchTerm);
    }
  }

  pagePrecedente(): void {
    if (this.page > 1) {
      this.page--;
      this.updateFilteredActualites(this.searchTerm);
    }
  }
}
