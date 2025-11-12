import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InscriptionService } from '../services/inscription';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class InscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup;
  formationId!: string;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inscriptionService: InscriptionService
  ) {}

  ngOnInit() {
    this.formationId = this.route.snapshot.paramMap.get('id')!;
    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      niveau: [''],
    });
  }

  onSubmit() {
    if (this.inscriptionForm.invalid) return;

    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = true;

    const data = { ...this.inscriptionForm.value, formationId: this.formationId };

    this.inscriptionService.inscrire(data).subscribe({
      next: () => {
        this.successMessage = ' Inscription réussie !';
        this.isLoading = false;

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/formations']);
        }, 2000);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = '❌ Erreur lors de l’inscription.';
        setTimeout(() => (this.errorMessage = ''), 2500);
      },
    });
  }
}
