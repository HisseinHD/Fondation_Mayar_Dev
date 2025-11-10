import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormationService, Formation } from '../../services/service.formation';

interface FormationModel {
  _id?: string;
  titre: string;
  description?: string;
  prix?: number;
  categorie?: string;
  image?: string;
  dateDebut?: string;
  dateFin?: string;
  showFullDescription?: boolean; // ✅ ajout de cette ligne
}

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation.html',
  styleUrls: ['./formation.css'],
})
export class FormationComponent implements OnInit {
  formations: FormationModel[] = [];
  loading = true;
  errorMessage = '';
  isConnected = false;

  constructor(private formationService: FormationService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isConnected = !!token;
    this.getAllFormations();
  }

  getAllFormations(): void {
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
      error: (err) => {
        console.error('Erreur lors du chargement des formations:', err);
        this.errorMessage = 'Erreur lors du chargement des formations';
        this.loading = false;
      },
    });
  }

  openFormationDetail(id?: string): void {
    if (!id) return;
    if (this.isConnected) {
      this.router.navigate(['/admin/formation', id]);
    } else {
      this.router.navigate(['/formation', id]);
    }
  }
  ouvrirFormulaireInscription(id?: string): void {
    if (!id) return; // empêche l'appel si id est manquant
    this.router.navigate(['/inscription', id]);
  }

  modifierFormation(id?: string): void {
    if (!id) return;
    this.router.navigate(['/admin/formation/modifier', id]);
  }

  supprimerFormation(id?: string): void {
    if (!id || !confirm('Confirmer la suppression de cette formation ?')) return;
    this.formationService.deleteFormation(id).subscribe({
      next: () => {
        this.formations = this.formations.filter((f) => f._id !== id);
      },
      error: (err) => {
        console.error('Erreur suppression formation:', err);
      },
    });
  }
}
