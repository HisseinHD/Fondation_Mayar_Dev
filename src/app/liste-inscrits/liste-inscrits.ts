import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

interface Candidat {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  niveau?: string;
  dateInscription?: string;
  statut?: 'en attente' | 'validé' | 'refusé';
}

@Component({
  selector: 'app-liste-inscrits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-inscrits.html',
  styleUrls: ['./liste-inscrits.css'],
})
export class ListeInscritsComponent implements OnInit {
  formationId!: string;
  candidats: Candidat[] = [];
  loading = true;
  errorMessage = '';
  statusOptions = ['en attente', 'validé', 'refusé'];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.formationId = this.route.snapshot.paramMap.get('id')!;
    this.chargerCandidats();
  }

  /** 🔹 Récupération des inscrits */
  chargerCandidats(): void {
    this.loading = true;
    this.getCandidats(this.formationId).subscribe({
      next: (res: any) => {
        this.candidats = res.candidats || res || []; // Gestion flexible de la réponse
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération candidats:', err);
        this.errorMessage = 'Impossible de charger les inscrits.';
        this.loading = false;
      },
    });
  }

  getCandidats(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/inscription/formation/${id}`);
  }

  /** 🔹 Supprimer un candidat - CORRIGÉ */
  supprimerCandidat(candidat: Candidat): void {
    if (!confirm(`Voulez-vous vraiment supprimer ${candidat.prenom} ${candidat.nom} ?`)) {
      return;
    }

    console.log('Suppression du candidat:', candidat._id); // Debug

    this.http.delete(`${environment.apiUrl}/inscription/${candidat._id}`).subscribe({
      next: (res: any) => {
        console.log('Suppression réussie:', res); // Debug
        // Filtrer le tableau pour retirer le candidat supprimé
        this.candidats = this.candidats.filter((c) => c._id !== candidat._id);
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression: ' + (err.error?.message || err.message));
      },
    });
  }

  /** 🔹 Modifier le statut */
  modifierStatut(candidat: Candidat, statut: string): void {
    const ancienStatut = candidat.statut;

    // Mise à jour optimiste de l'interface
    candidat.statut = statut as any;

    this.http
      .put(`${environment.apiUrl}/inscription/${candidat._id}/statut`, { statut })
      .subscribe({
        next: () => {
          console.log('Statut mis à jour avec succès');
        },
        error: (err) => {
          console.error('Erreur mise à jour statut:', err);
          // Revert en cas d'erreur
          candidat.statut = ancienStatut;
          alert('Erreur lors de la mise à jour du statut');
        },
      });
  }
}
