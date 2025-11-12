import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { FormationService } from '../../services/service.formation';

@Component({
  selector: 'app-create-formation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-forma.html',
  styleUrls: ['./create-forma.css'],
})
export class CreateForma {
  formationForm: FormGroup;
  categories: string[] = [
    'Informatique',
    'Santé',
    'Artisanat',
    'Langues',
    'Éducation',
    'Entrepreneuriat',
    'Humanitaire',
    'Autre',
  ];
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;

  // Modal
  showModal = false;
  modalMessage = '';
  modalType: 'loading' | 'success' | 'error' = 'loading';

  constructor(private fb: FormBuilder, private formationService: FormationService) {
    this.formationForm = this.fb.group(
      {
        titre: ['', [Validators.required, Validators.minLength(3)]],
        categorie: ['', Validators.required],
        prix: [null, [Validators.required, Validators.min(0)]],
        places: [null, [Validators.required, Validators.min(1)]],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        description: ['', [Validators.required, Validators.minLength(10)]],
      },
      { validators: this.dateValidator }
    );
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const debut = control.get('dateDebut')?.value;
    const fin = control.get('dateFin')?.value;
    return debut && fin && new Date(debut) > new Date(fin) ? { invalidDateRange: true } : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.imageFile);
    }
  }

  /** Soumission du formulaire */
  onSubmit(): void {
    if (this.formationForm.invalid || !this.imageFile) {
      this.showFeedback('Veuillez remplir correctement tous les champs.', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.formationForm.value).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
    formData.append('image', this.imageFile);

    this.showFeedback('Création de la formation en cours...', 'loading');
    this.isLoading = true;

    this.formationService.addFormation(formData).subscribe({
      next: () => {
        this.showFeedback('Formation créée avec succès !', 'success');
        this.formationForm.reset();
        this.imageFile = null;
        this.imagePreview = null;
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || '❌ Erreur lors de la création de la formation.';
        this.showFeedback(msg, 'error');
      },
      complete: () => (this.isLoading = false),
    });
  }

  /** Affiche un message dans une modale (auto-fermeture) */
  showFeedback(message: string, type: 'loading' | 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;

    if (type !== 'loading') {
      setTimeout(() => (this.showModal = false), 2500);
    }
  }

  get f() {
    return this.formationForm.controls;
  }
}
