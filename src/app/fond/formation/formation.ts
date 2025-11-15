import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormationService, Formation } from '../../services/service.formation';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formation.html',
  styleUrls: ['./formation.css'],
})
export class FormationComponent implements OnInit {
  formations: Formation[] = [];
  loading = false;
  errorMessage = '';

  formationForm!: FormGroup;

  showAddModal = false;
  categories = ['Informatique', 'Bureautique', 'Entrepreneuriat', 'Design', 'Autre'];

  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' | 'loading' = 'success';

  showEditModal = false;
  selectedFormation: Formation | null = null;
  formData: any = {};

  showDeleteModal = false;

  isConnected = true;

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
     const token = localStorage.getItem('token');

     // Si token → admin connecté → afficher tableau
     // Si pas de token → visiteur → afficher cartes
     this.isConnected = token ? true : false;

    this.initForm();
    this.loadFormations();
  }

  initForm() {
    this.formationForm = this.fb.group(
      {
        titre: ['', [Validators.required, Validators.minLength(3)]],
        categorie: ['', Validators.required],
        prix: [0, [Validators.required, Validators.min(0)]],
        places: [1, [Validators.required, Validators.min(1)]],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        description: ['', [Validators.required, Validators.minLength(10)]],
        image: [''],
      },
      { validators: this.validateDates }
    );
  }

  get f() {
    return this.formationForm.controls;
  }

  validateDates(group: FormGroup) {
    const d1 = group.get('dateDebut')?.value;
    const d2 = group.get('dateFin')?.value;
    return d1 && d2 && d2 < d1 ? { invalidDateRange: true } : null;
  }

  loadFormations() {
    this.loading = true;
    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = (data.formations ?? []).map((f: Formation) => ({
          ...f,
          showFullDescription: false,
        }));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement.';
        this.loading = false;
      },
    });
  }

  toggleDescription(f: any) {
    f.showFullDescription = !f.showFullDescription;
  }

  openAddModal() {
    this.showAddModal = true;
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.formationForm.reset();
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  showNotification(message: string, type: 'success' | 'error' | 'loading') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;

    if (type !== 'loading') {
      setTimeout(() => (this.showModal = false), 2000);
    }
  }

  // ✅ AJOUT DE FORMATION — VERSION CORRECTE
  onSubmit() {
    if (this.formationForm.invalid) return;

    this.showNotification('Création...', 'loading');

    const formData = new FormData();
    Object.keys(this.formationForm.value).forEach((key) => {
      formData.append(key, this.formationForm.value[key]);
    });

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    // 🚀 MÉTHODE CORRECTE
    this.formationService.addFormation(formData).subscribe({
      next: () => {
        this.showNotification('Formation créée avec succès', 'success');
        this.showAddModal = false;
        this.loadFormations();
      },
      error: () => {
        this.showNotification('Erreur lors de la création', 'error');
      },
    });
  }

  openDetail(id?: string) {
    if (!id) return;
    this.router.navigate(['/formation', id]);
  }

  ouvrirFormulaireInscription(id: string) {
    this.router.navigate(['/inscription', id]);
  }

  // 🟦 EDIT
  openEditModal(f: Formation) {
    this.selectedFormation = f;
    this.formData = { ...f };
    this.showEditModal = true;
  }

  updateFormation() {
    if (!this.selectedFormation) return;

    this.formationService.updateFormation(this.selectedFormation._id!, this.formData).subscribe({
      next: () => {
        this.showEditModal = false;
        this.loadFormations();
        this.showNotification('Formation mise à jour', 'success');
      },
      error: () => {
        this.showNotification('Erreur de mise à jour', 'error');
      },
    });
  }

  // 🔴 DELETE
  openDeleteModal(f: Formation) {
    this.selectedFormation = f;
    this.showDeleteModal = true;
  }

  deleteFormation() {
    if (!this.selectedFormation) return;

    this.formationService.deleteFormation(this.selectedFormation._id!).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.loadFormations();
        this.showNotification('Formation supprimée', 'success');
      },
      error: () => {
        this.showNotification('Erreur suppression', 'error');
      },
    });
  }
}
