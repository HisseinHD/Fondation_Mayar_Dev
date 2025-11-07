import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormationService, Formation } from '../../services/service.formation';

// Modèle pour la vue composant
interface FormationModel {
  _id?: string;
  titre: string;
  description?: string;
  prix?: number;
  categorie?: string;
  image?: string;
  dateDebut?: string; // ISO string
  dateFin?: string; // ISO string
}

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation.html',
  styleUrls: ['./formation.css'],
})
export class FormationComponent {
  formations: FormationModel[] = [];
  loading = true;
  errorMessage = '';
  isConnected = false; // 🔹 utilisateur connecté

  constructor(private formationService: FormationService, private router: Router) {}

  ngOnInit(): void {
    // Vérifie si un token existe → utilisateur connecté
    const token = localStorage.getItem('token');
    this.isConnected = !!token;

    this.getAllFormations();
  }

  getAllFormations() {
    this.loading = true;
    this.formationService.getFormations().subscribe({
      next: (response) => {
        const list: Formation[] = response.formations || response;
        this.formations = list.map((f) => ({
          ...f,
          dateDebut: f.dateDebut ? new Date(f.dateDebut).toISOString() : undefined,
          dateFin: f.dateFin ? new Date(f.dateFin).toISOString() : undefined,
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des formations:', err);
        this.errorMessage = 'Erreur lors du chargement des formations';
        this.loading = false;
      },
    });
  }

  // 🔹 Navigation vers le détail
  openFormationDetail(id?: string) {
    if (!id) return;
    if (this.isConnected) {
      // Redirige vers espace admin
      this.router.navigate(['/admin/formation', id]);
    } else {
      // Redirige vers espace public
      this.router.navigate(['/formation', id]);
    }
  }

  // 🔹 Formulaire d'inscription
  ouvrirFormulaireInscription(id: string) {
    this.router.navigate(['/inscription', id]);
  }

  // 🔧 Fonctions admin
  modifierFormation(id?: string) {
    if (!id) return;
    this.router.navigate(['/admin/formation/modifier', id]);
  }

  supprimerFormation(id?: string) {
    if (!id || !confirm('Confirmer la suppression de cette formation ?')) return;
    this.formationService.deleteFormation(id).subscribe({
      next: () => (this.formations = this.formations.filter((f) => f._id !== id)),
      error: (err: any) => console.error('Erreur suppression formation:', err),
    });
  }
}
