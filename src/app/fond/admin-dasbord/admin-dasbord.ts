import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @ViewChild('performanceChart') performanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donationsChart') donationsChartRef!: ElementRef<HTMLCanvasElement>;

  totalFormations = 0;
  totalCandidats = 0;
  formationsActives = 0;
  formationsPopulaires: any[] = [];
  inscriptionsParFormation: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const baseUrl = environment.apiUrl;
    const token = localStorage.getItem('token');

    this.http
      .get<any>(`${baseUrl}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          this.totalFormations = res.totalFormations;
          this.formationsActives = res.formationsActives;
          this.totalCandidats = res.totalCandidats;
          this.formationsPopulaires = res.formationsPopulaires;
          this.inscriptionsParFormation = res.inscriptionsParFormation;

          this.initializeCharts();
        },
        error: (err) => console.error('Erreur chargement dashboard', err),
      });
  }

  initializeCharts(): void {
    // Graphique Évolution des Inscriptions
    if (this.performanceChartRef) {
      const labels = this.inscriptionsParFormation.map((f) => f.titre);
      const data = this.inscriptionsParFormation.map((f) => f.inscriptions);

      new Chart(this.performanceChartRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Inscriptions',
              data,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, grid: { color: '#eee' } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    // Graphique Répartition par Catégorie (exemple statique)
    if (this.donationsChartRef) {
      new Chart(this.donationsChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Éducation', 'Santé', 'Entrepreneuriat', 'Humanitaire'],
          datasets: [
            {
              data: [40, 25, 20, 15],
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
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
