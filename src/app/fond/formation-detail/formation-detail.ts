import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormationService, Formation } from '../../services/service.formation';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation-detail.html',
  styleUrls: ['./formation-detail.css'],
})
export class FormationDetailComponent {
  formation?: Formation;
  loading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private formationService: FormationService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formationService.getFormation(id).subscribe({
        next: (data) => {
          this.formation = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur détail formation:', err);
          this.errorMessage = 'Erreur lors du chargement du détail.';
          this.loading = false;
        },
      });
    } else {
      this.errorMessage = 'ID de formation manquant dans l’URL.';
      this.loading = false;
    }
  }
}
