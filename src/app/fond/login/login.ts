import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .post('https://fondation-mayar-1.onrender.com/auth/login', this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Connexion réussie !';
          console.log('Token:', res.token);

          // Enregistre le token pour l'utiliser dans addProduct
          localStorage.setItem('token', res.token);

          // Redirection vers le workspace
          this.router.navigate(['/admin']);

          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur serveur';
          this.loading = false;
        },
      });
  }
}
