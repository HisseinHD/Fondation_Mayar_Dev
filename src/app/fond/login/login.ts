import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  otpForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  isRegisterMode: boolean = false;
  isForgotPasswordMode: boolean = false;
  isOtpMode: boolean = false;
  isOtpResetMode: boolean = false;
  isResetPasswordMode: boolean = false;
  loading: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  // Variables pour la vérification OTP
  pendingEmail: string = '';
  pendingOtpToken: string = '';
  pendingUserId: string = '';
  resendCooldown: number = 0;
  private resendInterval: any;

  // Variables pour la réinitialisation de mot de passe
  private resetToken: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.initForms();
    this.checkPendingVerification();
  }

  ngOnDestroy(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  initForms(): void {
    // Formulaire de connexion
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Formulaire d'inscription
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Formulaire mot de passe oublié
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Formulaire OTP (utilisé pour vérification email et réinitialisation)
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    // Formulaire de réinitialisation de mot de passe
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Vérifier s'il y a une vérification en attente
  checkPendingVerification(): void {
    const pending = localStorage.getItem('pendingVerification');
    if (pending) {
      const verificationData = JSON.parse(pending);
      this.pendingEmail = verificationData.email;
      this.pendingOtpToken = verificationData.otpToken;
      this.pendingUserId = verificationData.userId;
      this.switchToOtp();
    }
  }

  // Validateur pour vérifier que les mots de passe correspondent
  // Validateur générique : pass the names of the two controls in the form group
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordControl = control.get('password') || control.get('newPassword');
    const confirmControl = control.get('confirmPassword');

    if (passwordControl && confirmControl && passwordControl.value !== confirmControl.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Basculement entre les modes
  switchToLogin(): void {
    this.isRegisterMode = false;
    this.isForgotPasswordMode = false;
    this.isOtpMode = false;
    this.isOtpResetMode = false;
    this.isResetPasswordMode = false;
    this.clearMessages();
    this.clearPendingVerification();
  }

  switchToRegister(): void {
    this.isRegisterMode = true;
    this.isForgotPasswordMode = false;
    this.isOtpMode = false;
    this.isOtpResetMode = false;
    this.isResetPasswordMode = false;
    this.clearMessages();
  }

  switchToForgotPassword(): void {
    this.isRegisterMode = false;
    this.isForgotPasswordMode = true;
    this.isOtpMode = false;
    this.isOtpResetMode = false;
    this.isResetPasswordMode = false;
    this.clearMessages();
  }

  switchToOtp(): void {
    this.isRegisterMode = false;
    this.isForgotPasswordMode = false;
    this.isOtpMode = true;
    this.isOtpResetMode = false;
    this.isResetPasswordMode = false;
    this.clearMessages();
    this.startResendCooldown();
  }

  switchToOtpReset(): void {
    this.isRegisterMode = false;
    this.isForgotPasswordMode = false;
    this.isOtpMode = false;
    this.isOtpResetMode = true;
    this.isResetPasswordMode = false;
    this.clearMessages();
    this.startResendCooldown();
  }

  switchToResetPassword(): void {
    this.isRegisterMode = false;
    this.isForgotPasswordMode = false;
    this.isOtpMode = false;
    this.isOtpResetMode = false;
    this.isResetPasswordMode = true;
    this.clearMessages();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  clearPendingVerification(): void {
    localStorage.removeItem('pendingVerification');
    this.pendingEmail = '';
    this.pendingOtpToken = '';
    this.pendingUserId = '';
  }

  // Gestion du compte à rebours pour le renvoi d'OTP
  startResendCooldown(): void {
    this.resendCooldown = 60; // 60 secondes
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    this.resendInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  // Connexion
  login(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.clearMessages();

    this.http
      .post('https://fondation-mayar-1.onrender.com/auth/login', this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Connexion réussie !';
          console.log('Token:', res.token);

          // Enregistre le token
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

  // Inscription
  register(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.clearMessages();

    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.http.post('https://fondation-mayar-1.onrender.com/auth/register', registerData).subscribe({
      next: (res: any) => {
        this.loading = false;

        // Stocker les données pour la vérification OTP
        this.pendingEmail = res.email || registerData.email;
        this.pendingOtpToken = res.otpToken;
        this.pendingUserId = res.userId;

        // Sauvegarder dans le localStorage
        localStorage.setItem(
          'pendingVerification',
          JSON.stringify({
            otpToken: res.otpToken,
            userId: res.userId,
            email: res.email || registerData.email,
          })
        );

        // Basculer vers le mode OTP
        this.switchToOtp();

        this.successMessage = 'Code OTP envoyé à votre email !';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription";
        this.loading = false;
      },
    });
  }

  // Vérification OTP pour inscription
  verifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.loading = true;
    this.clearMessages();

    const otpData = {
      otp: this.otpForm.get('otp')?.value,
      otpToken: this.pendingOtpToken,
    };

    // Utiliser POST au lieu de PATCH
    this.http.post('https://fondation-mayar-1.onrender.com/auth/verify-email', otpData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = 'Email vérifié avec succès ! Redirection...';

        // Nettoyer les données en attente
        this.clearPendingVerification();

        // Redirection automatique vers la connexion après 2 secondes
        setTimeout(() => {
          this.switchToLogin();
          this.successMessage = 'Votre email a été vérifié. Vous pouvez maintenant vous connecter.';
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Code OTP invalide';
        this.loading = false;
      },
    });
  }

  // Renvoyer l'OTP
  resendOtp(): void {
    if (this.resendCooldown > 0) return;

    this.loading = true;
    this.clearMessages();

    // Déterminer l'endpoint en fonction du mode
    const endpoint = this.isOtpResetMode ? '/auth/forgot-password' : '/auth/resend-otp';
    const resendData = this.isOtpResetMode
      ? { email: this.pendingEmail }
      : { email: this.pendingEmail, otpToken: this.pendingOtpToken };

    this.http.post(`https://fondation-mayar-1.onrender.com${endpoint}`, resendData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = 'Nouveau code OTP envoyé !';

        // Mettre à jour le token OTP si reçu
        if (res.otpToken) {
          this.pendingOtpToken = res.otpToken;
        }

        this.startResendCooldown();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'envoi du code";
        this.loading = false;
      },
    });
  }

  // Mot de passe oublié - Étape 1: Demande de réinitialisation
  forgotPassword(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    this.clearMessages();

    this.http
      .post(
        'https://fondation-mayar-1.onrender.com/auth/forgot-password',
        this.forgotPasswordForm.value
      )
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.successMessage =
            res.message || 'Un code de réinitialisation a été envoyé à votre email.';

          console.log('🔍 Réponse forgot-password:', res);

          // Si un token OTP est retourné, basculer vers la vérification OTP
          if (res.otpToken) {
            this.pendingEmail = res.email || this.forgotPasswordForm.get('email')?.value;
            this.pendingOtpToken = res.otpToken;
            this.switchToOtpReset();
            console.log('✅ OTP Token reçu:', this.pendingOtpToken);
          } else {
            // Si pas de otpToken, peut-être que l'email n'existe pas mais le message est envoyé quand même
            this.successMessage =
              'Si votre email existe, un code de réinitialisation a été envoyé.';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('❌ Erreur forgot-password:', err);
          this.errorMessage = err.error?.message || "Erreur lors de l'envoi de l'email";
        },
      });
  }

  // Mot de passe oublié - Étape 2: Vérification OTP - CORRIGÉE
  verifyResetOtp(): void {
    // Validation manuelle plus robuste
    const otpValue = this.otpForm.get('otp')?.value;

    if (!otpValue || otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
      this.errorMessage = 'Veuillez entrer un code OTP valide de 6 chiffres';
      return;
    }

    if (!this.pendingOtpToken) {
      this.errorMessage = 'Erreur: Token de session manquant. Veuillez redémarrer le processus.';
      return;
    }

    this.loading = true;
    this.clearMessages();

    const otpData = {
      otp: otpValue,
      otpToken: this.pendingOtpToken,
    };

    console.log('🔍 Envoi vers verify-reset-otp:', otpData);

    this.http
      .post('https://fondation-mayar-1.onrender.com/auth/verify-reset-otp', otpData)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          console.log('✅ Réponse verify-reset-otp:', res);

          if (res.resetToken) {
            this.successMessage =
              'Code vérifié ! Vous pouvez maintenant définir un nouveau mot de passe.';
            this.resetToken = res.resetToken;
            this.switchToResetPassword();
          } else {
            this.errorMessage = 'Erreur: Token de réinitialisation non reçu.';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('❌ Erreur verify-reset-otp:', err);

          // Gestion d'erreur plus détaillée
          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 400) {
            this.errorMessage = 'Code OTP invalide ou expiré. Veuillez vérifier le code reçu.';
          } else if (err.status === 404) {
            this.errorMessage = 'Service temporairement indisponible. Veuillez réessayer.';
          } else {
            this.errorMessage =
              'Une erreur est survenue lors de la vérification. Veuillez réessayer.';
          }
        },
      });
  }

  // Mot de passe oublié - Étape 3: Réinitialisation du mot de passe
  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = 'Veuillez vérifier le formulaire.';
      return;
    }

    if (!this.resetToken) {
      this.errorMessage =
        'Erreur: Token de réinitialisation manquant. Veuillez recommencer le processus.';
      return;
    }

    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

    // Vérif côté client : mêmes checks que côté serveur (pratique UX)
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'La confirmation du mot de passe ne correspond pas.';
      return;
    }

    this.loading = true;
    this.clearMessages();

    const resetData = {
      resetToken: this.resetToken,
      newPassword,
      confirmPassword,
    };

    this.http
      .post('https://fondation-mayar-1.onrender.com/auth/reset-password', resetData)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.successMessage = 'Mot de passe réinitialisé avec succès ! Redirection...';

          // Nettoyer les données
          this.resetToken = '';
          this.resetPasswordForm.reset();

          setTimeout(() => {
            this.switchToLogin();
            this.successMessage =
              'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.';
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          // afficher message renvoyé par le serveur ou générique
          this.errorMessage =
            err.error?.message || 'Erreur lors de la réinitialisation du mot de passe';
          console.error('❌ Erreur reset-password:', err);
        },
      });
  }

  // Méthode utilitaire pour obtenir le titre OTP approprié
  getOtpTitle(): string {
    if (this.isOtpResetMode) {
      return 'Réinitialisation du mot de passe';
    }
    return "Vérification de l'email";
  }

  // Méthode utilitaire pour obtenir le message OTP approprié
  getOtpMessage(): string {
    if (this.isOtpResetMode) {
      return `Nous avons envoyé un code OTP de réinitialisation à <strong>${this.pendingEmail}</strong>`;
    }
    return `Nous avons envoyé un code OTP de vérification à <strong>${this.pendingEmail}</strong>`;
  }

  // Méthode pour réinitialiser complètement le processus mot de passe oublié
  resetForgotPasswordProcess(): void {
    this.pendingEmail = '';
    this.pendingOtpToken = '';
    this.resetToken = '';
    this.otpForm.reset();
    this.forgotPasswordForm.reset();
    this.resetPasswordForm.reset();
    this.switchToForgotPassword();
  }
}
