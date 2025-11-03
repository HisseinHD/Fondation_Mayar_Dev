import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

type StatutCandidat = 'en attente' | 'validé' | 'refusé';

interface Candidat {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  niveau?: string;
  formation?: { _id: string; titre: string }; // ✅ objet cohérent avec ton backend
  statut?: StatutCandidat;
  dateInscription?: string;
}

interface Formation {
  _id: string;
  titre: string;
}

@Component({
  selector: 'app-gestion-candidats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-candidats.html',
  styleUrls: ['./gestion-candidats.css'],
})
export class GestionCandidatsComponent implements OnInit {
  candidats: Candidat[] = [];
  formations: Formation[] = [];
  loading = true;
  errorMessage = '';
  filtreFormation: string = '';
  filtreNom: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFormations();
    this.getCandidats();
  }

  // 🔹 Récupération des formations
  getFormations() {
    this.http
      .get<Formation[]>('https://fondation-mayar-1.onrender.com/api/formations')
      .subscribe({
        next: (res) => (this.formations = Array.isArray(res) ? res : []),
        error: (err) => console.error('Erreur récupération formations', err),
      });
  }

  // 🔹 Récupération des candidats
  getCandidats() {
    this.loading = true;
    const url = 'https://fondation-mayar-1.onrender.com/api/inscription/candidats';
    this.http.get<Candidat[]>(url).subscribe({
      next: (res) => {
        this.candidats = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération candidats:', err);
        this.errorMessage = 'Impossible de charger les candidats';
        this.loading = false;
      },
    });
  }

  // 🔹 Filtrage par nom et formation
  filtrerCandidats(): Candidat[] {
    return this.candidats.filter(
      (c) =>
        (!this.filtreNom || c.nom.toLowerCase().includes(this.filtreNom.toLowerCase())) &&
        (!this.filtreFormation || c.formation?._id === this.filtreFormation)
    );
  }

  // 🔹 Récupérer le titre d’une formation
  getTitreFormation(formation?: { _id: string; titre: string }): string {
    return formation?.titre || 'N/A';
  }

  // 🔹 Modifier le statut
  modifierStatut(candidat: Candidat, statut: StatutCandidat) {
    if (!statut) return;
    this.http
      .put(
        `https://fondation-mayar-1.onrender.com/api/inscription/${candidat._id}/statut`,
        { statut }
      )
      .subscribe({
        next: () => (candidat.statut = statut),
        error: (err) => console.error('Erreur mise à jour statut', err),
      });
  }

  // 🔹 Supprimer un candidat
  supprimerCandidat(id: string) {
    if (!confirm('Confirmer la suppression ?')) return;
    this.http
      .delete(`https://fondation-mayar-1.onrender.com/api/inscription/${id}`)
      .subscribe({
        next: () => (this.candidats = this.candidats.filter((c) => c._id !== id)),
        error: (err) => console.error('Erreur suppression candidat', err),
      });
  }
}
