import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormationService } from '../../services/service.formation';

// 👇 Modèle pour Formation
interface FormationModel {
  _id?: string;
  titre: string;
  description?: string;
  prix?: number;
  categorie?: string;
  image?: string;
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

  constructor(
    private formationService: FormationService,
    private router: Router // ✅ pour la navigation
  ) {}

  ngOnInit(): void {
    this.getAllFormations();
  }

  getAllFormations() {
    this.loading = true;
    this.formationService.getFormations().subscribe({
      next: (response) => {
        // Vérifie si l’API renvoie { formations: [...] } ou juste [...]
        this.formations = response.formations || response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations:', err);
        this.errorMessage = 'Erreur lors du chargement des formations';
        this.loading = false;
      },
    });
  }

  // ✅ Fonction appelée quand on clique sur une carte
  openFormationDetail(id?: string) {
    if (!id) return;
    this.router.navigate(['/formation', id]);
  }

  ouvrirFormulaireInscription(id: string) {
    this.router.navigate(['/inscription', id]);
  }
}
