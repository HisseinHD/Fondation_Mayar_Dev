import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  /** 🧩 Charge les statistiques globales du tableau de bord */
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

          // Initialise le graphique d’évolution
          this.initializeCharts();

          // Charge les données réelles pour les catégories
          this.loadFormationsParCategorie();
        },
        error: (err) => console.error('Erreur chargement dashboard', err),
      });
  }

  /** 📊 Génère le graphique de performance (évolution des inscriptions) */
  initializeCharts(): void {
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
  }

  /** 🍩 Charge les formations et compte combien il y en a par catégorie */
  loadFormationsParCategorie(): void {
    const baseUrl = environment.apiUrl;
    const token = localStorage.getItem('token');

    this.http
      .get<any>(`${baseUrl}/formations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          // Si ton backend renvoie un objet { formations: [...] }
          const formations = Array.isArray(res) ? res : res.formations;

          if (!formations || !Array.isArray(formations)) {
            console.error('⚠️ Données inattendues reçues :', res);
            return;
          }

          // Comptage des formations par catégorie
          const counts: Record<string, number> = {};

          formations.forEach((f) => {
            const cat = f.categorie?.trim() || 'Autre';
            counts[cat] = (counts[cat] || 0) + 1;
          });

          // Labels (catégories)
          const labels = Object.keys(counts);
          // Données (nombre de formations par catégorie)
          const data = Object.values(counts);

          // Génération du graphique dynamique
          this.generateCategorieChart(labels, data);
        },
        error: (err) => console.error('Erreur chargement formations', err),
      });
  }

  /** 🎨 Crée le graphique en anneau pour la répartition par catégorie */
  generateCategorieChart(labels: string[], data: number[]): void {
    if (this.donationsChartRef) {
      new Chart(this.donationsChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                '#3b82f6', // bleu
                '#10b981', // vert
                '#f59e0b', // orange
                '#ef4444', // rouge
                '#8b5cf6', // violet
                '#06b6d4', // cyan
                '#84cc16', // lime
                '#f97316', // amber
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
                  return `${context.label}: ${value} formation${value > 1 ? 's' : ''}`;
                },
              },
            },
          },
        },
      });
    }
  }
}
