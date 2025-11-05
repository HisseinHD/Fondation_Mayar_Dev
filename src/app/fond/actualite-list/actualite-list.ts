import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActualiteService } from '../../services/actualite';
import { Actualite } from '../../services/actualite';

@Component({
  selector: 'app-actualite-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './actualite-list.html',
  styleUrls: ['./actualite-list.css'],
})
export class ActualiteListComponent implements OnInit {
  actualites: Actualite[] = [];
  loading = true;
  error = '';

  constructor(private actualiteService: ActualiteService) {}

  ngOnInit() {
    this.loadActualites();
  }

  loadActualites() {
    this.actualiteService.getAll().subscribe({
      next: (res: any) => {
        this.actualites = res.actualites || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement actualités', err);
        this.error = 'Impossible de charger les actualités.';
        this.loading = false;
      },
    });
  }
}
