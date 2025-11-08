import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; // nécessaire pour [(ngModel)]

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
        this.candidats = res.candidats || [];
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
    return this.http.get(`http://localhost:3000/api/inscription/formation/${id}`);
  }

  /** 🔹 Supprimer un candidat */
  supprimerCandidat(id: string): void {
    if (!confirm('Voulez-vous vraiment supprimer ce candidat ?')) return;

    this.http.delete(`http://localhost:3000/api/inscription/${id}`).subscribe({
      next: () => {
        this.candidats = this.candidats.filter((c) => c._id !== id);
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      },
    });
  }

  /** 🔹 Modifier le statut */
  modifierStatut(candidat: Candidat, statut: string): void {
    this.http
      .put(`http://localhost:3000/api/inscription/${candidat._id}/statut`, { statut })
      .subscribe({
        next: () => {
          candidat.statut = statut as any;
        },
        error: (err) => {
          console.error('Erreur mise à jour statut:', err);
          alert('Erreur lors de la mise à jour du statut');
        },
      });
  }
}
