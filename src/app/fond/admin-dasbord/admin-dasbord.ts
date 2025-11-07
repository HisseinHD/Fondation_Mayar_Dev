import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dasbord.html',
  styleUrls: ['./admin-dasbord.css'],
})
export class AdminDasbord implements OnInit {
  totalFormations = 0;
  totalCandidats = 0;
  formationsActives = 0;
  formationsPopulaires: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    this.initializeCharts();
  }

  loadStats(): void {
    const baseUrl = environment.apiUrl;

    this.http.get<any>(`${baseUrl}/formations`).subscribe({
      next: (formations) => {
        const list = formations.formations || formations;
        this.totalFormations = Array.isArray(list) ? list.length : 0;
        this.formationsActives = Array.isArray(list) ? list.filter((f: any) => f.active).length : 0;
        this.formationsPopulaires = Array.isArray(list) ? list.slice(0, 3) : [];
      },
      error: (err) => console.error('Erreur chargement formations', err),
    });

    this.http.get<any>(`${baseUrl}/inscription/candidats`).subscribe({
      next: (candidats) => (this.totalCandidats = Array.isArray(candidats) ? candidats.length : 0),
      error: (err) => console.error('Erreur chargement candidats', err),
    });
  }

  initializeCharts(): void {
    const perfCanvas = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (perfCanvas) {
      new Chart(perfCanvas, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [
            {
              label: 'Inscriptions',
              data: [12, 19, 8, 15, 22, 30, 18],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#eee' } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    const donationsCanvas = document.getElementById('donationsChart') as HTMLCanvasElement;
    if (donationsCanvas) {
      new Chart(donationsCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Éducation', 'Santé', 'Entrepreneuriat', 'Humanitaire'],
          datasets: [
            {
              data: [40, 25, 20, 15],
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
        },
      });
    }
  }
}
