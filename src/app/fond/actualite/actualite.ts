import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActualiteService, Actualite } from '../../services/actualite';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-actualite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './actualite.html',
  styleUrls: ['./actualite.css'],
})
export class ActualiteComponent implements OnInit {
  actualiteForm!: FormGroup;
  actualites: Actualite[] = [];
  selectedImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private actualiteService: ActualiteService) {}

  ngOnInit(): void {
    this.actualiteForm = this.fb.group({
      titre: ['', Validators.required],
      contenu: ['', Validators.required],
      description: [''],
    });

    this.loadActualites();
  }

  loadActualites(): void {
    this.actualiteService.getAll().subscribe({
      next: (res) => (this.actualites = res.actualites || []),
      error: (err) => console.error('Erreur chargement actualités', err),
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(this.selectedImage);
    }
  }

  submit(): void {
    if (this.actualiteForm.invalid || !this.selectedImage) {
      this.errorMessage = 'Remplissez tous les champs et ajoutez une image.';
      return;
    }

    const formData = new FormData();
    Object.entries(this.actualiteForm.value).forEach(([key, value]) =>
      formData.append(key, value as any)
    );
    formData.append('image', this.selectedImage);

    this.isLoading = true;

    this.actualiteService.add(formData).subscribe({
      next: () => {
        alert('✅ Actualité ajoutée avec succès');
        this.actualiteForm.reset();
        this.previewImage = null;
        this.loadActualites();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors de l’ajout';
      },
      complete: () => (this.isLoading = false),
    });
  }

  delete(id: string): void {
    if (confirm('Supprimer cette actualité ?')) {
      this.actualiteService.delete(id).subscribe({
        next: () => {
          alert('🗑️ Supprimée avec succès');
          this.loadActualites();
        },
        error: (err) => console.error('Erreur suppression', err),
      });
    }
  }
}
