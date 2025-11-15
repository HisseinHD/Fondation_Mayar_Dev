import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormationService, Formation } from '../../services/service.formation';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formation.html',
  styleUrls: ['./formation.css'],
})
export class FormationComponent implements OnInit {
  formations: (Formation & { showFullDescription: boolean })[] = [];
  loading = true;
  errorMessage = '';
  isConnected = false;

  // Pagination
  page: number = 1;
  limit: number = 5;
  total: number = 0;
  totalPages: number = 1;

  // Modales
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedFormation: Formation | null = null;

  // Formulaire ajout / modif
  formData: any = {
    titre: '',
    description: '',
    prix: 0,
    categorie: '',
    dateDebut: '',
    dateFin: '',
    places: 0,
  };
  imageFile: File | null = null;

  constructor(private formationService: FormationService, private router: Router) {}

  ngOnInit(): void {
    this.isConnected = !!localStorage.getItem('token');
    this.getAllFormations();
  }

  // ====================== Récupération formations ======================
  getAllFormations(): void {
    this.loading = true;

    this.formationService.getFormations(this.page, this.limit).subscribe({
      next: (response: any) => {
        const data: Formation[] = response.formations ?? response;

        // Tri décroissant par date de création, sécurité pour undefined
        this.formations = data
          .sort(
            (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
          )
          .map((f: Formation) => ({
            ...f,
            showFullDescription: false,
          }));

        this.total = response.total ?? this.formations.length;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement.';
        this.loading = false;
      },
    });
  }

  // ====================== Inscription ======================
  ouvrirFormulaireInscription(id: string) {
    this.router.navigate(['/inscription', id]);
  }

  // ====================== Pagination ======================
  pageSuivante() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getAllFormations();
    }
  }

  pagePrecedente() {
    if (this.page > 1) {
      this.page--;
      this.getAllFormations();
    }
  }

  // ====================== Modales et formulaire ======================
  openAddModal() {
    this.showAddModal = true;
    this.resetForm();
  }

  openEditModal(f: Formation) {
    this.selectedFormation = f;
    this.showEditModal = true;
    this.formData = { ...f };
  }

  openDeleteModal(f: Formation) {
    this.selectedFormation = f;
    this.showDeleteModal = true;
  }

  handleImage(event: any) {
    this.imageFile = event.target.files[0];
  }

  addFormation() {
    const data = new FormData();
    Object.keys(this.formData).forEach((key) => data.append(key, this.formData[key]));
    if (this.imageFile) data.append('image', this.imageFile);

    this.formationService.addFormation(data).subscribe({
      next: () => {
        this.showAddModal = false;
        this.page = 1; // nouvelle formation en tête
        this.getAllFormations();
      },
      error: (e) => console.error(e),
    });
  }

  updateFormation() {
    if (!this.selectedFormation?._id) return;
    const data = new FormData();
    Object.keys(this.formData).forEach((key) => data.append(key, this.formData[key]));
    if (this.imageFile) data.append('image', this.imageFile);

    this.formationService.updateFormation(this.selectedFormation._id, data).subscribe({
      next: () => {
        this.showEditModal = false;
        this.getAllFormations();
      },
      error: (e) => console.error(e),
    });
  }

  deleteFormation() {
    if (!this.selectedFormation?._id) return;
    this.formationService.deleteFormation(this.selectedFormation._id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.formations = this.formations.filter((x) => x._id !== this.selectedFormation?._id);
      },
      error: (e) => console.error(e),
    });
  }

  // ====================== Utilitaires ======================
  toggleDescription(f: any) {
    f.showFullDescription = !f.showFullDescription;
  }

  openDetail(id?: string) {
    if (!id) return;
    this.router.navigate(['/formation', id]);
  }

  resetForm() {
    this.formData = {
      titre: '',
      description: '',
      prix: 0,
      categorie: '',
      dateDebut: '',
      dateFin: '',
      places: 0,
    };
    this.imageFile = null;
  }
}
