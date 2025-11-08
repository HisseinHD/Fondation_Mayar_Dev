import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActualiteService, Actualite } from '../../services/actualite';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private actualiteService: ActualiteService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isConnected = !!token;
    this.getAllActualites();
  }

  getAllActualites(): void {
    this.loading = true;
    this.actualiteService.getAll().subscribe({
      next: (response) => {
        const list: Actualite[] = response.actualites || response;
        this.actualites = list.map((a) => ({
          ...a,
          createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : undefined,
        }));
        this.filteredActualites = this.actualites;
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
    this.filteredActualites = this.actualites.filter(
      (act) =>
        act.titre.toLowerCase().includes(term) ||
        (act.description && act.description.toLowerCase().includes(term))
    );
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
        this.filteredActualites = this.filteredActualites.filter((a) => a._id !== id);
      },
      error: (err) => {
        console.error('Erreur suppression actualité:', err);
      },
    });
  }
}
