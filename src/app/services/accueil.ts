import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface Niveau {
  nom: string;
  horaire: string;
  duree?: string;
}

export interface Formation {
  _id: string;
  titre: string;
  description: string;
  image: string;
  niveaux: Niveau[];
  formateur: {
    nom: string;
    prenom: string;
    email: string;
    tel: string;
  };
  dateDebut: Date;
  dateFin: Date;
}

export interface FormationsResponse {
  message: string;
  formations: Formation[];
  total: number;
  page: number;
  pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class Accueil {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Envoi du formulaire de contact
  sendContactMessage(contactData: ContactForm): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/contact`, contactData, { headers });
  }

  // Récupération de toutes les formations
  getFormations(page: number = 1, limit: number = 6): Observable<FormationsResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<FormationsResponse>(`${this.apiUrl}/formations`, { params });
  }

  // Récupération des formations récentes
  getRecentFormations(limit: number = 3): Observable<FormationsResponse> {
    const params = new HttpParams().set('page', '1').set('limit', limit.toString());
    return this.http.get<FormationsResponse>(`${this.apiUrl}/formations`, { params });
  }
}
