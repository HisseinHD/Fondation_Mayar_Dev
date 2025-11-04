import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Formation {
  _id?: string;
  titre: string;
  prix: number;
  image: string;
  description?: string;
  categorie?: string;
  places?: number;
  formateur?: any;
  dateDebut?: Date;
  dateFin?: Date;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private apiUrl = `${environment.apiUrl}/formations`; // ← dynamique selon environment

  constructor(private http: HttpClient) {}

  // 🔐 Fonction utilitaire pour ajouter le header d’auth
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // récupère le token depuis le login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ➕ Ajouter une formation
  addFormation(data: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/add`, data, { headers });
  }

  // 📄 Récupérer les formations (avec pagination)
  getFormations(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}`);
  }

  // 📄 Récupérer une formation par id
  getFormation(id: string): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  // ❌ Supprimer une formation
  deleteFormation(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // ✏️ Mettre à jour une formation
  updateFormation(id: string, data: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }
}
