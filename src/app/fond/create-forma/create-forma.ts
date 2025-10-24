import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private formationService: FormationService) {
    this.formationForm = this.fb.group({
      titre: ['', Validators.required],
      categorie: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      places: [0, [Validators.min(0)]],
      dateDebut: [''],
      dateFin: [''],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.imageFile);
    }
  }

  onSubmit(): void {
    if (this.formationForm.invalid || !this.imageFile) {
      this.errorMessage = 'Veuillez remplir tous les champs requis et ajouter une image.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    Object.entries(this.formationForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });
    formData.append('image', this.imageFile);

    this.formationService.addFormation(formData).subscribe({
      next: () => {
        alert('Formation créée avec succès !');
        this.formationForm.reset();
        this.imagePreview = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors de la création de la formation.';
      },
      complete: () => (this.isLoading = false),
    });
  }
}
