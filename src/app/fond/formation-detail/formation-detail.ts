// src/app/fond/formation-detail/formation-detail.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService, Formation } from '../../services/service.formation';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation-detail.html',
  styleUrls: ['./formation-detail.css'],
})
export class FormationDetailComponent implements OnInit {
  loading = true;
  errorMessage = '';
  formation: Formation | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Identifiant de formation manquant.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.formationService.getFormation(id).subscribe({
      next: (data: Formation) => {
        this.formation = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement de la formation.';
        this.loading = false;
      },
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  revenir(): void {
    this.router.navigate(['/formations']); // adapte si ta route est différente
  }
}
