import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'https://fondation-mayar-1.onrender.com/api/actualites';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: string): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.apiUrl}/${id}`);
  }

  add(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
