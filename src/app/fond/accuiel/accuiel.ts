// accuiel.component.ts
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Accueil, ContactForm, Formation } from '../../services/accueil';
import { FormationComponent } from '../formation/formation';
import { ActualiteListComponent } from '../actualite-list/actualite-list';
import { AproposComponent } from '../../apropos/apropos';

@Component({
  selector: 'app-accuiel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormationComponent,
    ActualiteListComponent,
    AproposComponent,
  ],
  templateUrl: './accuiel.html',
  styleUrls: ['./accuiel.css'],
})
export class Accuiel implements OnInit {
  contactForm: FormGroup;
  isLoading = false;
  messageSent = false;
  errorMessage = '';

  // Nouvelles propriétés pour les formations
  formations: Formation[] = [];
  loadingFormations = false;
  errorFormations = '';

  constructor(
    private fb: FormBuilder,
    private accueil: Accueil,
    private viewportScroller: ViewportScroller
  ) {
    this.contactForm = this.createForm();
  }

  ngOnInit() {
    this.loadRecentFormations();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  scrollToSection(id: string) {
    this.viewportScroller.scrollToAnchor(id);
  }

  // Charger les formations récentes
  loadRecentFormations(): void {
    this.loadingFormations = true;
    this.errorFormations = '';

    this.accueil.getRecentFormations(3).subscribe({
      next: (response) => {
        this.loadingFormations = false;
        this.formations = response.formations;
      },
      error: (error) => {
        this.loadingFormations = false;
        this.errorFormations = 'Erreur lors du chargement des formations';
        console.error('Erreur formations:', error);
      },
    });
  }

  // Gestion des erreurs d'image
  onImageError(event: any): void {
    event.target.src = 'assets/default-formation.png';
  }

  // Méthode pour l'envoi du formulaire de contact
  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData: ContactForm = this.contactForm.value;

      this.accueil.sendContactMessage(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageSent = true;
          this.contactForm.reset();

          // Ajouter fade out avant de masquer complètement
          setTimeout(() => {
            const alert = document.querySelector('.alert-success');
            if (alert) alert.classList.add('fade-out');
          }, 1500); // attendre 1,5s avant fade out

          setTimeout(() => {
            this.messageSent = false; // retire le message après l'animation
          }, 2000); // correspond à la durée totale (fade + buffer)
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.error || "Erreur lors de l'envoi du message. Veuillez réessayer.";

          // Ajouter fade out pour message d'erreur
          setTimeout(() => {
            const alert = document.querySelector('.alert-danger');
            if (alert) alert.classList.add('fade-out');
          }, 1500);

          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);

          console.error('Erreur:', error);
        },
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get message() {
    return this.contactForm.get('message');
  }
}
