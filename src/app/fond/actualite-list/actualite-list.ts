import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-actualite-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './actualite-list.html',
  styleUrls: ['./actualite-list.css'],
})
export class ActualiteListComponent implements OnInit {
  actualites: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadActualites();
  }

  loadActualites() {
    this.http.get<any>('http://localhost:3000/api/actualites').subscribe({
      next: (res) => {
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
