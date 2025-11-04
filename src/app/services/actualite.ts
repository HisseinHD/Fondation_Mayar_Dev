import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/ environment'; // ← import environment

export interface Actualite {
  _id?: string;
  titre: string;
  contenu: string;
  description?: string;
  image?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActualiteService {
  private apiUrl = `${environment.apiUrl}/actualites`; // ← dynamique selon environment

  constructor(private http: HttpClient) {}

  // 🔐 Header d’authentification pour routes protégées
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 📄 Récupérer toutes les actualités
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 📄 Récupérer une actualité par ID
  getById(id: string): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.apiUrl}/${id}`);
  }

  // ➕ Ajouter une actualité
  add(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✏️ Mettre à jour une actualité
  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ❌ Supprimer une actualité
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
