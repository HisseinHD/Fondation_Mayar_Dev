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
  private apiUrl = `${environment.apiUrl}/formations`;

  constructor(private http: HttpClient) {}

  // 🔐 Headers avec token pour authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });
  }

  // ➕ Ajouter une formation
  addFormation(data: FormData): Observable<{ message: string; formation: Formation }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string; formation: Formation }>(`${this.apiUrl}/add`, data, {
      headers,
    });
  }

  // 📄 Récupérer toutes les formations (avec pagination optionnelle)
  getFormations(page: number = 1): Observable<{ formations: Formation[] }> {
    return this.http.get<{ formations: Formation[] }>(`${this.apiUrl}?page=${page}`);
  }

  // 📄 Récupérer une formation par ID
  getFormation(id: string): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  // ❌ Supprimer une formation
  deleteFormation(id: string): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }

  // ✏️ Mettre à jour une formation
  updateFormation(id: string, data: FormData): Observable<Formation> {
    const headers = this.getAuthHeaders();
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, data, { headers });
  }
}
