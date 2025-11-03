import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
declare var Chart: any; // Déclare Chart pour éviter les erreurs TypeScript

@Component({
  selector: 'app-admin-dasbord',
  imports: [CommonModule],
  templateUrl: './admin-dasbord.html',
  styleUrl: './admin-dasbord.css',
})
export class AdminDasbord implements OnInit {
  ngOnInit(): void {
    this.initializeCharts();
  }

  initializeCharts(): void {
    // --- 📊 Performance Chart ---
    const performanceCanvas = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (performanceCanvas) {
      const performanceCtx = performanceCanvas.getContext('2d');
      if (performanceCtx) {
        new Chart(performanceCtx, {
          type: 'line',
          data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [
              {
                label: 'Participants',
                data: [65, 78, 66, 82, 90, 75, 60],
                borderColor: '#202425ff',
                backgroundColor: 'rgba(2, 2, 2, 0.15)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { drawBorder: false } },
              x: { grid: { display: false } },
            },
          },
        });
      }
    }

    // --- 🎯 Donations Chart ---
    const donationsCanvas = document.getElementById('donationsChart') as HTMLCanvasElement;
    if (donationsCanvas) {
      const donationsCtx = donationsCanvas.getContext('2d');
      if (donationsCtx) {
        new Chart(donationsCtx, {
          type: 'doughnut',
          data: {
            labels: ['Éducation', 'Santé', 'Entrepreneuriat', 'Aide Humanitaire'],
            datasets: [
              {
                data: [35, 25, 20, 20],
                backgroundColor: ['#48cae4', '#0096c7', '#ffd166', '#6c757d'],
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
}