import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

type StatutCandidat = 'en attente' | 'validé' | 'refusé';

interface Candidat {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  niveau?: string;
  formation?: { _id: string; titre: string };
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
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gestion-candidats.html',
  styleUrls: ['./gestion-candidats.css'],
})
export class GestionCandidatsComponent implements OnInit {
  candidats: Candidat[] = [];
  formations: Formation[] = [];

  loading = true;
  errorMessage = '';
  filtreFormation = '';
  filtreNom = '';

  showModal = false;

  candidatEdit: any = {
    _id: '',
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    niveau: '',
    formation: { _id: '' },
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFormations();
    this.getCandidats();
  }

  getFormations() {
    this.http.get<Formation[]>('https://fondation-mayar-1.onrender.com/api/formations').subscribe({
      next: (res) => {
        this.formations = Array.isArray(res) ? res : [];
      },
      error: () => {
        this.formations = [];
      },
    });
  }

  getCandidats() {
    this.loading = true;

    this.http
      .get<Candidat[]>('https://fondation-mayar-1.onrender.com/api/inscription/candidats')
      .subscribe({
        next: (res) => {
          this.candidats = Array.isArray(res) ? res : [];
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Impossible de charger les candidats';
          this.loading = false;
        },
      });
  }

  filtrerCandidats(): Candidat[] {
    return this.candidats.filter(
      (c) =>
        (!this.filtreNom || c.nom.toLowerCase().includes(this.filtreNom.toLowerCase())) &&
        (!this.filtreFormation || c.formation?._id === this.filtreFormation)
    );
  }

  modifierStatut(candidat: Candidat, statut: StatutCandidat) {
    this.http
      .put(`https://fondation-mayar-1.onrender.com/api/inscription/${candidat._id}/statut`, {
        statut,
      })
      .subscribe({
        next: () => {
          candidat.statut = statut;
        },
      });
  }

  supprimerCandidat(id: string) {
    const ok = confirm('Confirmer la suppression ?');
    if (!ok) return;

    this.http.delete(`https://fondation-mayar-1.onrender.com/api/inscription/${id}`).subscribe({
      next: () => {
        this.candidats = this.candidats.filter((c) => c._id !== id);
      },
    });
  }

  ouvrirModal(c: Candidat) {
    this.candidatEdit = {
      _id: c._id,
      nom: c.nom,
      prenom: c.prenom,
      email: c.email,
      tel: c.tel,
      niveau: c.niveau || '',
      formation: { _id: c.formation?._id || '' },
    };
    this.showModal = true;
  }

  fermerModal() {
    this.showModal = false;
    this.candidatEdit = {
      _id: '',
      nom: '',
      prenom: '',
      email: '',
      tel: '',
      niveau: '',
      formation: { _id: '' },
    };
  }

  sauvegarderEdition() {
    if (!this.candidatEdit) return;

    const payload = {
      nom: this.candidatEdit.nom,
      prenom: this.candidatEdit.prenom,
      email: this.candidatEdit.email,
      tel: this.candidatEdit.tel,
      niveau: this.candidatEdit.niveau,
      formation: this.candidatEdit.formation._id || null,
    };

    this.http
      .put(
        `https://fondation-mayar-1.onrender.com/api/inscription/${this.candidatEdit._id}`,
        payload
      )
      .subscribe({
        next: () => {
          const index = this.candidats.findIndex((c) => c._id === this.candidatEdit._id);
          if (index !== -1) {
            this.candidats[index] = {
              ...this.candidats[index],
              ...this.candidatEdit,
              formation: { _id: this.candidatEdit.formation._id },
            };
          }
          this.fermerModal();
        },
      });
  }
}
